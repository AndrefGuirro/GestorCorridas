// idb-helper.js - wrapper simples sobre IndexedDB (promises)

const DB_NAME = 'km_control_db';
const DB_VERSION = 1;

const STORE_NAMES = {
  VEICULOS: 'veiculos',
  CORRIDAS: 'corridas',
  MANUT: 'manutencoes'
};

const db = {
  open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = () => {
        const idb = req.result;

        if (!idb.objectStoreNames.contains(STORE_NAMES.VEICULOS)) {
          idb.createObjectStore(STORE_NAMES.VEICULOS, {
            keyPath: 'id',
            autoIncrement: true
          });
        }

        if (!idb.objectStoreNames.contains(STORE_NAMES.CORRIDAS)) {
          idb.createObjectStore(STORE_NAMES.CORRIDAS, {
            keyPath: 'id',
            autoIncrement: true
          });
        }

        if (!idb.objectStoreNames.contains(STORE_NAMES.MANUT)) {
          idb.createObjectStore(STORE_NAMES.MANUT, {
            keyPath: 'id',
            autoIncrement: true
          });
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  tx(storeName, mode = 'readonly') {
    return this.open()
      .then(database => database.transaction(storeName, mode).objectStore(storeName));
  },

  add(storeName, value) {
    return this.tx(storeName, 'readwrite')
      .then(store => new Promise((res, rej) => {
        const r = store.add(value);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      }));
  },

  put(storeName, value) {
    return this.tx(storeName, 'readwrite')
      .then(store => new Promise((res, rej) => {
        const r = store.put(value);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      }));
  },

  get(storeName, key) {
    return this.tx(storeName)
      .then(store => new Promise((res, rej) => {
        const r = store.get(key);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      }));
  },

  getAll(storeName) {
    return this.tx(storeName)
      .then(store => new Promise((res, rej) => {
        const r = store.getAll();
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      }));
  },

  delete(storeName, key) {
    return this.tx(storeName, 'readwrite')
      .then(store => new Promise((res, rej) => {
        const r = store.delete(key);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      }));
  }
};

/* 🔥 A LINHA MAIS IMPORTANTE 🔥
   Torna o db acessível para TODOS os scripts */
window.db = db;
window.STORE_NAMES = STORE_NAMES;
