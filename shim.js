/* Fair Sourcing Log: standalone storage layer.
   The app was written against a small "claude.use(...)" interface (a database, photo storage, file saving,
   dictation). This file provides the same interface on the phone itself, so the app runs with no server:
   data lives in IndexedDB, photos are stored as blobs, files are saved through the browser. */
(function () {
  'use strict';
  window.__standalone = true;
  var SEED = [{"id":"n001","l1":"Woven tops","cat":"Long-sleeve shirts","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n002","l1":"Woven tops","cat":"Long-sleeve shirts","details":"Linen","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n003","l1":"Woven tops","cat":"Long-sleeve shirts","details":"Performance / travel","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n004","l1":"Woven tops","cat":"Long-sleeve shirts","details":"Flannel","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n005","l1":"Woven tops","cat":"Short-sleeve shirts","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n006","l1":"Woven tops","cat":"Short-sleeve shirts","details":"Linen","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n007","l1":"Woven tops","cat":"Short-sleeve shirts","details":"Performance / travel","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n008","l1":"Woven tops","cat":"Overshirts","details":"Shirt jacket","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n009","l1":"Woven tops","cat":"Overshirts","details":"Utility overshirt","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n010","l1":"Woven tops","cat":"Sleeveless tops","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n011","l1":"Woven tops","cat":"Sleeveless tops","details":"Linen","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n012","l1":"Woven tops","cat":"Short-sleeve tops","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n013","l1":"Woven tops","cat":"Short-sleeve tops","details":"Linen","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n014","l1":"Woven tops","cat":"Long-sleeve tops","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n015","l1":"Woven tops","cat":"Long-sleeve tops","details":"Linen","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n016","l1":"Woven tops","cat":"Tunics","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n017","l1":"Woven tops","cat":"Tunics","details":"Linen","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n018","l1":"Woven bottoms","cat":"Pants","details":"Hiking","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n019","l1":"Woven bottoms","cat":"Pants","details":"Travel","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n020","l1":"Woven bottoms","cat":"Pants","details":"Convertible zip-off","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n021","l1":"Woven bottoms","cat":"Pants","details":"Cargo","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n022","l1":"Woven bottoms","cat":"Pants","details":"Chino","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n023","l1":"Woven bottoms","cat":"Shorts","details":"Hiking","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n024","l1":"Woven bottoms","cat":"Shorts","details":"Cargo","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n025","l1":"Woven bottoms","cat":"Shorts","details":"Chino","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n026","l1":"Woven bottoms","cat":"Skirts & skorts","details":"Skirt","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n027","l1":"Woven bottoms","cat":"Skirts & skorts","details":"Skort","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n098","l1":"Knit tops","cat":"T-shirts","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n099","l1":"Knit tops","cat":"T-shirts","details":"Performance / quick-dry","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n100","l1":"Knit tops","cat":"T-shirts","details":"Merino blend","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n101","l1":"Knit tops","cat":"T-shirts","details":"UPF sun","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n102","l1":"Knit tops","cat":"Long-sleeve tees","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n103","l1":"Knit tops","cat":"Long-sleeve tees","details":"Performance / quick-dry","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n104","l1":"Knit tops","cat":"Long-sleeve tees","details":"UPF sun shirt","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n105","l1":"Knit tops","cat":"Polos","details":"Cotton pique","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n106","l1":"Knit tops","cat":"Polos","details":"Performance","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n107","l1":"Knit tops","cat":"Tank tops","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n108","l1":"Knit tops","cat":"Tank tops","details":"Performance","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n109","l1":"Knit tops","cat":"Henleys","details":"Short-sleeve henley","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n110","l1":"Knit tops","cat":"Henleys","details":"Long-sleeve henley","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n111","l1":"Knit tops","cat":"Hoodies & sweatshirts","details":"Pullover hoodie","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n112","l1":"Knit tops","cat":"Hoodies & sweatshirts","details":"Zip hoodie","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n113","l1":"Knit tops","cat":"Hoodies & sweatshirts","details":"Crew sweatshirt","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n114","l1":"Knit bottoms","cat":"Leggings & tights","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n115","l1":"Knit bottoms","cat":"Leggings & tights","details":"Performance","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n116","l1":"Knit bottoms","cat":"Leggings & tights","details":"Capri","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n117","l1":"Knit bottoms","cat":"Joggers & track pants","details":"Jogger","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n118","l1":"Knit bottoms","cat":"Joggers & track pants","details":"Track pant","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n119","l1":"Knit bottoms","cat":"Knit shorts","details":"Cotton","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n120","l1":"Knit bottoms","cat":"Knit shorts","details":"Performance / running","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n028","l1":"Rainwear","cat":"Rain jackets","details":"Packable","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n029","l1":"Rainwear","cat":"Rain jackets","details":"Long / trench","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n030","l1":"Rainwear","cat":"Rain jackets","details":"Kids'","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w02","l1":"Rainwear","cat":"Ponchos","details":"With pocket","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n031","l1":"Rainwear","cat":"Ponchos","details":"Basic","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n032","l1":"Rainwear","cat":"Ponchos","details":"Kids'","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n033","l1":"Rainwear","cat":"Rain pants","details":"Packable","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n034","l1":"Rainwear","cat":"Rain pants","details":"Kids'","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n035","l1":"Rainwear","cat":"Umbrellas","details":"Compact","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n036","l1":"Rainwear","cat":"Umbrellas","details":"Trekking","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n037","l1":"Rainwear","cat":"Pack covers","details":"Small","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n038","l1":"Rainwear","cat":"Pack covers","details":"Medium","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n039","l1":"Rainwear","cat":"Pack covers","details":"Large","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n040","l1":"Winter wear","cat":"Insulated jackets","details":"Down","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n041","l1":"Winter wear","cat":"Insulated jackets","details":"Synthetic","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n042","l1":"Winter wear","cat":"Insulated jackets","details":"Insulated vest","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n043","l1":"Winter wear","cat":"Fleece","details":"Fleece jacket","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n044","l1":"Winter wear","cat":"Fleece","details":"Fleece pullover","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n045","l1":"Winter wear","cat":"Fleece","details":"Fleece vest","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n046","l1":"Winter wear","cat":"Base layers","details":"Thermal top","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n047","l1":"Winter wear","cat":"Base layers","details":"Thermal bottom","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n048","l1":"Accessories","cat":"Headwear","details":"Cap","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n049","l1":"Accessories","cat":"Headwear","details":"Boonie hat","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n050","l1":"Accessories","cat":"Headwear","details":"Bucket hat","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n051","l1":"Accessories","cat":"Headwear","details":"Sun hat","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n052","l1":"Accessories","cat":"Headwear","details":"Beanie","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n053","l1":"Accessories","cat":"Headwear","details":"Balaclava","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n054","l1":"Accessories","cat":"Headwear","details":"Visor","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n055","l1":"Accessories","cat":"Headwear","details":"Headband & ear warmer","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n056","l1":"Accessories","cat":"Gloves","details":"Liner gloves","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n057","l1":"Accessories","cat":"Gloves","details":"Fleece gloves","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n058","l1":"Accessories","cat":"Gloves","details":"Insulated gloves","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n059","l1":"Accessories","cat":"Gloves","details":"Waterproof gloves","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n060","l1":"Accessories","cat":"Gloves","details":"Mittens","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n061","l1":"Accessories","cat":"Gloves","details":"Sun gloves","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n062","l1":"Accessories","cat":"Socks","details":"Hiking","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n063","l1":"Accessories","cat":"Socks","details":"Running","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n064","l1":"Accessories","cat":"Socks","details":"Casual","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n065","l1":"Accessories","cat":"Socks","details":"Snow","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n066","l1":"Accessories","cat":"Socks","details":"Compression","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n067","l1":"Accessories","cat":"Socks","details":"Liner","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w09","l1":"Accessories","cat":"Neckwear","details":"Neck gaiter - summer UPF 50","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n068","l1":"Accessories","cat":"Neckwear","details":"Neck gaiter - fleece","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n069","l1":"Accessories","cat":"Neckwear","details":"Bandana","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n070","l1":"Accessories","cat":"Neckwear","details":"Scarf","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n071","l1":"Accessories","cat":"Hydration","details":"Steel insulated bottle","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n072","l1":"Accessories","cat":"Hydration","details":"Plastic bottle","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n073","l1":"Accessories","cat":"Hydration","details":"Collapsible bottle","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n074","l1":"Accessories","cat":"Hydration","details":"Tumbler","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n075","l1":"Accessories","cat":"Hydration","details":"Reservoir","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n076","l1":"Accessories","cat":"Hydration","details":"Filter bottle","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w01","l1":"Accessories","cat":"Hand & foot warmers","details":"Hand warmer - pack of 2","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n077","l1":"Accessories","cat":"Hand & foot warmers","details":"Toe / foot warmer","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n078","l1":"Accessories","cat":"Hand & foot warmers","details":"Rechargeable warmer","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n079","l1":"Accessories","cat":"Belts & wallets","details":"Belt","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n080","l1":"Accessories","cat":"Belts & wallets","details":"Wallet","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n081","l1":"Accessories","cat":"Belts & wallets","details":"Money belt","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n082","l1":"Accessories","cat":"Eyewear","details":"Sunglasses","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n083","l1":"Accessories","cat":"Eyewear","details":"Sunglass cord","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w03","l1":"Bags","cat":"Dry bags","details":"Phone pouch","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w05","l1":"Bags","cat":"Dry bags","details":"3 L roll-top","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w06","l1":"Bags","cat":"Dry bags","details":"5 L roll-top","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n084","l1":"Bags","cat":"Dry bags","details":"10 L roll-top","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n085","l1":"Bags","cat":"Dry bags","details":"Dry duffel","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w10","l1":"Bags","cat":"Laptop bags","details":"Laptop sleeve","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n086","l1":"Bags","cat":"Laptop bags","details":"Laptop backpack","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w07","l1":"Bags","cat":"Laptop bags","details":"Waterproof 20 L","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w08","l1":"Bags","cat":"Laptop bags","details":"Waterproof 30 L","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"w11","l1":"Bags","cat":"Day bags","details":"Side sling bag","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n087","l1":"Bags","cat":"Day bags","details":"Shoulder bag","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n088","l1":"Bags","cat":"Day bags","details":"Tote","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n089","l1":"Bags","cat":"Day bags","details":"Gym bag","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n090","l1":"Bags","cat":"Day bags","details":"Waist pack","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n091","l1":"Bags","cat":"Backpacks","details":"Daypack","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n092","l1":"Bags","cat":"Backpacks","details":"Travel pack","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n093","l1":"Bags","cat":"Duffels","details":"Travel duffel","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n094","l1":"Bags","cat":"Duffels","details":"Wheeled duffel","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n095","l1":"Bags","cat":"Organisers & pouches","details":"Packing cubes","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n096","l1":"Bags","cat":"Organisers & pouches","details":"Toiletry bag","cp":"","sp":"","mrp":"","moq":"","must":""},{"id":"n097","l1":"Bags","cat":"Organisers & pouches","details":"Utility pouch","cp":"","sp":"","mrp":"","moq":"","must":""}];
  var DBNAME = 'fair-sourcing-log';
  var docs = {}, blobs = {}, urls = {}, subs = { sup: [], wish: [] }, queued = false, idb = null;

  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var mapErr = function (e) { return { code: (e && e.name === 'QuotaExceededError') ? 'quota_exceeded' : 'unavailable', message: String((e && e.message) || e) }; };

  function openDB() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(DBNAME, 1);
      r.onupgradeneeded = function () {
        var d = r.result;
        if (!d.objectStoreNames.contains('docs')) d.createObjectStore('docs');
        if (!d.objectStoreNames.contains('assets')) d.createObjectStore('assets');
      };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function eachRow(name, fn) {
    return new Promise(function (res, rej) {
      var t = idb.transaction(name, 'readonly'), r = t.objectStore(name).openCursor();
      r.onsuccess = function () { var c = r.result; if (c) { fn(c.key, c.value); c.continue(); } else res(); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function put(name, key, val) {
    return new Promise(function (res, rej) {
      var t;
      try { t = idb.transaction(name, 'readwrite'); t.objectStore(name).put(val, key); } catch (e) { rej(mapErr(e)); return; }
      t.oncomplete = function () { res(); };
      t.onerror = t.onabort = function () { rej(mapErr(t.error)); };
    });
  }
  function del(name, key) {
    return new Promise(function (res, rej) {
      var t = idb.transaction(name, 'readwrite'); t.objectStore(name).delete(key);
      t.oncomplete = function () { res(); };
      t.onerror = t.onabort = function () { rej(mapErr(t.error)); };
    });
  }

  function supSnap() {
    var list = Object.keys(docs).filter(function (k) { return k.indexOf('suppliers/') === 0; }).map(function (k) {
      var id = k.slice(10);
      return { id: id, data: function () { return clone(docs[k]); } };
    });
    return { docs: list, size: list.length, empty: !list.length, metadata: { fromCache: false }, docChanges: function () { return []; } };
  }
  function wishSnap() {
    var d = docs['config/wishlist'];
    return { exists: !!d, data: function () { return d ? clone(d) : undefined; }, metadata: { fromCache: false } };
  }
  function emit() {
    if (queued) return; queued = true;
    Promise.resolve().then(function () {
      queued = false;
      var s = supSnap(), w = wishSnap();
      subs.sup.forEach(function (f) { try { f(s); } catch (e) { } });
      subs.wish.forEach(function (f) { try { f(w); } catch (e) { } });
    });
  }
  function docRef(path) {
    return {
      id: path.split('/').pop(),
      set: function (d) { var v = clone(d); return put('docs', path, v).then(function () { docs[path] = v; emit(); }); },
      delete: function () { return del('docs', path).then(function () { delete docs[path]; emit(); }); },
      onSnapshot: function (next) { subs.wish.push(next); setTimeout(function () { next(wishSnap()); }, 0); return function () { subs.wish = subs.wish.filter(function (f) { return f !== next; }); }; }
    };
  }
  var db = {
    collection: function (name) {
      return {
        doc: function (id) { return docRef(name + '/' + id); },
        onSnapshot: function (next) { subs.sup.push(next); setTimeout(function () { next(supSnap()); }, 0); return function () { subs.sup = subs.sup.filter(function (f) { return f !== next; }); }; }
      };
    },
    doc: function (path) { return docRef(path); }
  };

  function rand32() { var a = new Uint8Array(16); (window.crypto || window.msCrypto).getRandomValues(a); return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  var assets = {
    upload: function (blob, opts) {
      var id = (opts && opts.id) || rand32();
      return put('assets', id, blob).then(function () { blobs[id] = blob; delete urls[id]; return { id: id }; });
    }
  };
  window.__blobUrl = function (id) {
    if (!urls[id] && blobs[id]) urls[id] = URL.createObjectURL(blobs[id]);
    return urls[id] || '';
  };

  var MIME = { zip: 'application/zip', csv: 'text/csv', json: 'application/json', txt: 'text/plain', html: 'text/html' };
  var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var downloads = {
    save: async function (req) {
      var name = String(req.filename || 'file'), ext = (name.split('.').pop() || '').toLowerCase(), type = MIME[ext] || 'application/octet-stream';
      var blob = (typeof Blob !== 'undefined' && req.data instanceof Blob) ? req.data : new Blob([req.data], { type: type });
      if ((req.share || isIOS) && navigator.canShare && typeof File !== 'undefined') {
        try {
          var f = new File([blob], name, { type: type });
          if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: name }); return { status: 'saved', shared: true }; }
        } catch (e) {
          if (e && e.name === 'AbortError') throw { code: 'declined', message: 'cancelled' };
          /* asked to share but the phone refused (often: the tap was too long ago): let the caller ask for a fresh tap */
          if (req.share) throw { code: 'share-failed', message: (e && e.message) || 'share failed' };
        }
      }
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = name; a.style.display = 'none'; document.body.appendChild(a); a.click();
      setTimeout(function () { try { document.body.removeChild(a); URL.revokeObjectURL(url); } catch (e) { } }, 4000);
      return { status: 'saved' };
    }
  };

  window.__canShareFiles = function () {
    try { return !!(navigator.share && navigator.canShare && typeof File !== 'undefined' && navigator.canShare({ files: [new File(['x'], 'x.zip', { type: 'application/zip' })] })); }
    catch (e) { return false; }
  };

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var dictation = null;
  if (SR) {
    var rec = null, stateCb = function () { }, finalCb = function () { };
    dictation = {
      onState: function (f) { stateCb = f; },
      onFinal: function (f) { finalCb = f; },
      start: function () {
        return new Promise(function (res, rej) {
          try {
            rec = new SR(); rec.lang = 'en-IN'; rec.continuous = true; rec.interimResults = false;
            rec.onstart = function () { stateCb({ state: 'listening' }); res(); };
            rec.onresult = function (e) { for (var i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) finalCb({ text: String(e.results[i][0].transcript || '').trim() }); } };
            rec.onerror = function (e) { stateCb({ state: 'idle' }); };
            rec.onend = function () { stateCb({ state: 'idle' }); };
            rec.start();
          } catch (e) { rej(e); }
        });
      },
      stop: function () { try { if (rec) rec.stop(); } catch (e) { } return Promise.resolve(); }
    };
  }

  var ready = (async function () {
    try {
      idb = await openDB();
      await eachRow('docs', function (k, v) { docs[k] = v; });
      await eachRow('assets', function (k, v) { blobs[k] = v; });
      if (!docs['config/wishlist'] && SEED.length) { var seed = { items: SEED, updatedAt: 1 }; await put('docs', 'config/wishlist', seed); docs['config/wishlist'] = seed; }
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
      return true;
    } catch (e) { idb = null; return false; }
  })();

  window.claude = {
    use: function (name) {
      return ready.then(function (ok) {
        if (!ok) return null;
        return name === 'db' ? db : name === 'assets' ? assets : name === 'downloads' ? downloads : name === 'dictation' ? dictation : null;
      });
    }
  };

  /* install button */
  var installing = false;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); window.__installEvt = e; });
  window.addEventListener('appinstalled', function () { window.__installEvt = null; });
  var isInstalled = function () { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; };
  window.__installHTML = function () {
    var body;
    if (isInstalled()) body = '<p class="dim small" style="margin:0">This is the installed app. It works with no signal, and everything you enter stays on this phone.</p>';
    else if (window.__installEvt) body = '<p class="dim small" style="margin:0">Put it on your home screen so it opens like an app and works with no signal.</p><button class="btn primary" data-act="pwa-install">Install this app</button>';
    else if (isIOS) body = '<p class="dim small" style="margin:0">On iPhone: tap the Share button in Safari, then Add to Home Screen. It then opens like an app and works with no signal.</p>';
    else body = '<p class="dim small" style="margin:0">In Chrome, open the menu and choose Install app (or Add to Home screen). It then opens like an app and works with no signal.</p>';
    return '<div class="card sec"><h2>On this phone</h2>' + body + '</div>';
  };

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); });
  }
})();
