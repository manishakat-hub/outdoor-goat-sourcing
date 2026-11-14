/* Demo mode. Loaded before the app. When the page is not running inside Claude
   (window.claude is missing), this stands in for the three Claude capabilities the
   app can use without an AI model: a small database, photo storage and file saving.
   Everything is kept in this browser's localStorage. All names, numbers and prices
   below are made up. Card scan, note reading and voice are switched off here
   because they need Claude. */
(function () {
  if (window.claude) return;
  var NS = 'ogs-demo:';
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var read = function (k, d) { try { var v = JSON.parse(localStorage.getItem(NS + k) || 'null'); return v == null ? d : v; } catch (e) { return d; } };
  var write = function (k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { /* storage full: keep working in memory */ } };

  function seed() {
    var now = Date.now(), day = 86400000;
    var wish = { updatedAt: now, items: [
      { id: 'w01', cat: 'Handwarmer', details: 'Pack of 2', cp: '55', sp: '299', mrp: '399', moq: '500', must: 'Odourless, Individually packed' },
      { id: 'w02', cat: 'Poncho', details: 'With pocket', cp: '140', sp: '699', mrp: '899', moq: '300', must: 'Hood, Packs into pouch' },
      { id: 'w03', cat: 'Drybag', details: '5 L', cp: '220', sp: '999', mrp: '1299', moq: '200', must: 'Roll-top, Welded seams' },
      { id: 'w04', cat: 'Laptop sleeve', details: '15 inch', cp: '260', sp: '1199', mrp: '1499', moq: '200', must: 'Padded' },
      { id: 'w05', cat: 'Neck gaiter', details: 'UPF 50', cp: '90', sp: '499', mrp: '699', moq: '500', must: 'UPF 50, Quick-dry' },
      { id: 'w06', cat: 'Sling bag', details: 'Water resistant', cp: '300', sp: '1399', mrp: '1799', moq: '200', must: '' }
    ] };
    var P = function (id, wishId, price, moq, lead, colors, material, features, sample, notes) {
      return { id: id, wish: wishId, name: '', ref: '', price: price, moq: moq, lead: lead, material: material, colors: colors, features: features, sample: sample, notes: notes || '', photos: [] };
    };
    var S = function (id, o) {
      return Object.assign({ id: id, createdAt: now - 2 * day, updatedAt: now - day, company: '', contact: '', phone: '', email: '', hall: '', stall: '', city: '',
        status: 'new', rating: 0, notes: '', card: '', type: '', role: '', phone2: '', website: '', address: '', offers: '', auto: {}, products: [] }, o);
    };
    var suppliers = {};
    suppliers.s_demo1 = S('s_demo1', { company: 'Sample Rainwear Works', contact: 'Demo Contact', phone: '+91 90000 00001', email: 'sales@sample-rainwear.example',
      hall: '12', stall: '34', city: 'Jaipur, Rajasthan', type: 'mfr', status: 'follow', rating: 4, offers: 'Ponchos, raincoats, drybags',
      notes: 'Own factory. Can do welded seams. Asked for a spec sheet.',
      products: [
        P('p_demo1', 'w02', '150', '300', '30', 'Navy, Olive', 'PEVA', 'Hood, Packs into pouch', 'free', '150 rupees, MOQ 300, ready in a month'),
        P('p_demo2', 'w03', '240', '200', '45', 'Black, Orange', '500D PVC', 'Roll-top, Welded seams', 'paid')
      ] });
    suppliers.s_demo2 = S('s_demo2', { company: 'Example Heat Packs', contact: 'Test Person', phone: '+91 90000 00002', hall: '12', stall: '08',
      city: 'Ludhiana, Punjab', type: 'trader', status: 'sample', rating: 3,
      products: [ P('p_demo3', 'w01', '48', '1000', '20', '', 'Air-activated', 'Odourless, Skin safe', 'free') ] });
    suppliers.s_demo3 = S('s_demo3', { company: 'Demo Textiles Pvt Ltd', contact: 'Sample Name', phone: '+91 90000 00003', hall: '9', stall: '15',
      city: 'Tiruppur, Tamil Nadu', type: 'export', status: 'new', rating: 0,
      products: [ P('p_demo4', 'w05', '95', '600', '30', 'Black, Grey, Navy', 'Polyester', 'UPF 50, Quick-dry', '') ] });
    return { suppliers: suppliers, docs: { 'config/wishlist': wish } };
  }

  var data = read('db', null);
  if (!data) { data = seed(); write('db', data); }
  var photos = read('photos', {});
  var save = function () { write('db', data); };

  var colSubs = [], docSubs = {};
  function colSnap() {
    var docs = Object.keys(data.suppliers).map(function (id) { return { id: id, data: function () { return clone(data.suppliers[id]); } }; });
    return { docs: docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false }, docChanges: function () { return []; } };
  }
  function docSnap(path) {
    var v = data.docs[path];
    return { exists: v != null, data: function () { return v == null ? undefined : clone(v); }, metadata: { fromCache: false } };
  }
  var later = function (fn) { setTimeout(fn, 0); };

  var db = {
    collection: function () {
      return {
        doc: function (id) {
          return {
            id: id,
            set: async function (d) { data.suppliers[id] = clone(d); save(); later(function () { colSubs.slice().forEach(function (n) { n(colSnap()); }); }); },
            delete: async function () { delete data.suppliers[id]; save(); later(function () { colSubs.slice().forEach(function (n) { n(colSnap()); }); }); }
          };
        },
        onSnapshot: function (next) {
          colSubs.push(next); later(function () { next(colSnap()); });
          return function () { colSubs = colSubs.filter(function (x) { return x !== next; }); };
        }
      };
    },
    doc: function (path) {
      return {
        set: async function (d) { data.docs[path] = clone(d); save(); later(function () { (docSubs[path] || []).slice().forEach(function (n) { n(docSnap(path)); }); }); },
        onSnapshot: function (next) {
          (docSubs[path] = docSubs[path] || []).push(next); later(function () { next(docSnap(path)); });
          return function () { docSubs[path] = (docSubs[path] || []).filter(function (x) { return x !== next; }); };
        }
      };
    }
  };

  var assets = {
    upload: function (blob) {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onerror = function () { reject({ code: 'read_failed' }); };
        r.onload = function () {
          var id = 'demo' + Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(14)), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
          photos[id] = r.result; write('photos', photos);
          resolve({ id: id });
        };
        r.readAsDataURL(blob);
      });
    }
  };
  window.__photoURL = function (id) { return photos[id] || ''; };

  var downloads = {
    save: async function (f) {
      var url = URL.createObjectURL(new Blob([f.data], { type: 'text/csv;charset=utf-8' }));
      var a = document.createElement('a'); a.href = url; a.download = f.filename; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
      return { status: 'saved' };
    }
  };

  window.claude = { use: async function (name) { return name === 'db' ? db : name === 'assets' ? assets : name === 'downloads' ? downloads : null; } };

  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.id = 'demo-bar';
    bar.setAttribute('role', 'note');
    bar.style.cssText = 'background:#F6E8C3;color:#4d3500;font:500 13px/1.4 system-ui,sans-serif;padding:8px 14px;text-align:center';
    bar.innerHTML = 'Demo with made-up sample data, kept only in this browser. Card scan, note reading and voice need Claude and are switched off here. ' +
      '<button id="demo-reset" style="margin-left:6px;border:0;background:none;color:#7A2E0E;font:inherit;font-weight:600;text-decoration:underline;cursor:pointer">Reset sample data</button>';
    document.body.insertBefore(bar, document.body.firstChild);
    document.getElementById('demo-reset').addEventListener('click', function () {
      try {
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf(NS) === 0 || k.indexOf('fsl.') === 0) localStorage.removeItem(k); });
      } catch (e) {}
      location.reload();
    });
  });
})();
