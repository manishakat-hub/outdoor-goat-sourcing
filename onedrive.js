/* Fair Sourcing Log: OneDrive sync.
   Signs in with Microsoft (authorization code + PKCE, no server and no secret) and keeps one file,
   "Fair Sourcing Log/fair-log-sync.zip", in the signed-in person's OneDrive.
   Sync = download that file, merge it into this phone (the app does the merge), then upload the result.
   Works for personal Microsoft accounts and for work or school accounts. */
(function () {
  'use strict';
  var AUTH = 'https://login.microsoftonline.com/common/oauth2/v2.0/';
  var GRAPH = 'https://graph.microsoft.com/v1.0';
  var SCOPE = 'Files.ReadWrite User.Read offline_access';
  var FOLDER = 'Fair Sourcing Log', FILE = 'fair-log-sync.zip';
  var KT = 'fsl-od-token', KP = 'fsl-od-pkce', KL = 'fsl-od-last';
  var MAXUP = 240 * 1024 * 1024; /* Microsoft's single-request upload limit is 250 MB */

  function cid() { return String(window.ONEDRIVE_CLIENT_ID || '').trim(); }
  function redirectUri() { return new URL('./', location.href).href; }
  function lsGet(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { } }
  function fail(code, message) { var e = new Error(message || code); e.code = code; return e; }

  function b64u(buf) {
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function rand(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return b64u(a); }
  function form(o) { return Object.keys(o).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(o[k]); }).join('&'); }
  function enc(s) { return encodeURIComponent(s).replace(/%2F/g, '/'); }
  var PATH = '/me/drive/root:/' + enc(FOLDER) + '/' + enc(FILE);

  /* ---- sign in ---- */
  async function signIn() {
    if (!cid()) throw fail('notconfigured', 'OneDrive sync is not set up yet.');
    if (!(window.crypto && crypto.subtle)) throw fail('insecure', 'Sign-in needs a secure (https) page.');
    var verifier = rand(48), state = rand(16);
    var challenge = b64u(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    lsSet(KP, { v: verifier, s: state, t: Date.now() });
    location.assign(AUTH + 'authorize?' + form({
      client_id: cid(), response_type: 'code', redirect_uri: redirectUri(), response_mode: 'query',
      scope: SCOPE, state: state, code_challenge: challenge, code_challenge_method: 'S256'
    }));
  }

  async function tokenCall(params) {
    var res;
    try {
      res = await fetch(AUTH + 'token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form(params) });
    } catch (e) { throw fail('offline', 'No connection.'); }
    var j = {};
    try { j = await res.json(); } catch (e) { }
    if (!res.ok || !j.access_token) {
      var err = fail(j.error === 'invalid_grant' || j.error === 'interaction_required' ? 'reauth' : 'token', j.error_description || j.error || 'Sign-in failed.');
      throw err;
    }
    return j;
  }
  function keepToken(j, prev) {
    var t = {
      a: j.access_token,
      r: j.refresh_token || (prev && prev.r) || '',
      exp: Date.now() + (Number(j.expires_in) || 3600) * 1000 - 60000,
      acct: (prev && prev.acct) || ''
    };
    lsSet(KT, t);
    return t;
  }

  /* Runs once when the page loads: finishes a sign-in if Microsoft just sent the person back here. */
  var ready = (async function () {
    try {
      var p = new URLSearchParams(location.search);
      if (!p.has('code') && !p.has('error')) return null;
      var pk = lsGet(KP);
      if (!pk || p.get('state') !== pk.s) return null; /* not our redirect */
      lsDel(KP);
      history.replaceState(null, '', location.pathname + location.hash);
      if (p.get('error')) return { error: p.get('error_description') || p.get('error') };
      if (Date.now() - (pk.t || 0) > 15 * 60 * 1000) return { error: 'The sign-in took too long. Please try again.' };
      var j = await tokenCall({ client_id: cid(), grant_type: 'authorization_code', code: p.get('code'), redirect_uri: redirectUri(), code_verifier: pk.v, scope: SCOPE });
      var t = keepToken(j, null);
      try {
        var me = await (await fetch(GRAPH + '/me?$select=displayName,userPrincipalName,mail', { headers: { Authorization: 'Bearer ' + t.a } })).json();
        t.acct = me.mail || me.userPrincipalName || me.displayName || 'your Microsoft account';
        lsSet(KT, t);
      } catch (e) { }
      return { ok: true };
    } catch (e) { return { error: e.message || 'Sign-in failed.' }; }
  })();

  async function getToken() {
    var t = lsGet(KT);
    if (!t || (!t.a && !t.r)) throw fail('signedout', 'Not signed in.');
    if (t.a && Date.now() < t.exp) return t.a;
    if (!t.r) throw fail('reauth', 'Your Microsoft sign-in has expired.');
    try {
      var j = await tokenCall({ client_id: cid(), grant_type: 'refresh_token', refresh_token: t.r, scope: SCOPE });
      return keepToken(j, t).a;
    } catch (e) {
      if (e.code === 'reauth') { lsSet(KT, { a: '', r: '', exp: 0, acct: t.acct || '' }); }
      throw e;
    }
  }
  function signOut() { lsDel(KT); lsDel(KP); }

  /* ---- OneDrive (Microsoft Graph) ---- */
  async function graph(path, opts, retried) {
    var tok = await getToken();
    var o = opts || {}, h = Object.assign({}, o.headers || {}, { Authorization: 'Bearer ' + tok });
    var res;
    try { res = await fetch(GRAPH + path, Object.assign({}, o, { headers: h })); }
    catch (e) { throw fail('offline', 'No connection.'); }
    if (res.status === 401 && !retried) {
      var t = lsGet(KT); if (t) { t.exp = 0; lsSet(KT, t); }
      return graph(path, opts, true);
    }
    return res;
  }

  async function getRemote() {
    var res = await graph(PATH);
    if (res.status === 404) return null;
    if (!res.ok) throw fail('graph', 'OneDrive said no (' + res.status + ').');
    var meta = await res.json(), buf = null;
    var url = meta['@microsoft.graph.downloadUrl'];
    if (url) { try { var d = await fetch(url); if (d.ok) buf = await d.arrayBuffer(); } catch (e) { } }
    if (!buf) {
      var c = await graph('/me/drive/items/' + encodeURIComponent(meta.id) + '/content');
      if (!c.ok) throw fail('graph', 'Could not read the file on OneDrive (' + c.status + ').');
      buf = await c.arrayBuffer();
    }
    return { buf: buf, etag: meta.eTag || '', modified: meta.lastModifiedDateTime || '' };
  }

  async function putRemote(blob, etag) {
    if (blob.size > MAXUP) throw fail('toobig', 'The backup is too large to upload in one go (' + Math.round(blob.size / 1048576) + ' MB).');
    var h = { 'Content-Type': 'application/zip' }, q = '';
    if (etag) h['If-Match'] = etag; else q = '?@microsoft.graph.conflictBehavior=fail';
    var res = await graph(PATH + ':/content' + q, { method: 'PUT', headers: h, body: blob });
    if (res.status === 412 || res.status === 409) throw fail('conflict', 'Someone else just synced.');
    if (res.status === 507) throw fail('quota', 'Your OneDrive is full.');
    if (!res.ok) throw fail('graph', 'Could not save to OneDrive (' + res.status + ').');
    return true;
  }

  /* hooks.merge(arrayBuffer) merges a downloaded file into the phone; hooks.build() returns {blob, suppliers, photos} */
  async function sync(hooks) {
    var out = { merged: null, built: null };
    for (var attempt = 0; attempt < 3; attempt++) {
      var remote = await getRemote();
      if (remote) out.merged = await hooks.merge(remote.buf);
      out.built = await hooks.build();
      try { await putRemote(out.built.blob, remote ? remote.etag : ''); }
      catch (e) { if (e.code === 'conflict' && attempt < 2) continue; throw e; }
      lsSet(KL, new Date().toISOString());
      out.hadRemote = !!remote;
      return out;
    }
  }

  function state() {
    var t = lsGet(KT);
    return {
      signedIn: !!(t && (t.r || (t.a && Date.now() < t.exp))),
      needsLogin: !!(t && !t.a && !t.r),
      account: (t && t.acct) || '',
      last: lsGet(KL) || ''
    };
  }
  function explain(e) {
    var c = e && e.code;
    if (c === 'offline') return 'No connection. Try again when you have a signal.';
    if (c === 'reauth' || c === 'signedout') return 'Please sign in to Microsoft again.';
    if (c === 'quota') return 'Your OneDrive is full.';
    if (c === 'conflict') return 'Another phone synced at the same moment. Tap Sync now again.';
    return (e && e.message) || 'Could not sync with OneDrive.';
  }

  window.OneDrive = { configured: function () { return !!cid(); }, ready: ready, signIn: signIn, signOut: signOut, sync: sync, state: state, explain: explain, redirectUri: redirectUri };
})();
