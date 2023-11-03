const DB_NAME = "myDatabase";
const DB_VERSION = 1;
let db: IDBDatabase;

/**
 * 打开 IndexedDB 数据库连接
 */
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("打开数据库失败"));
    };

    request.onsuccess = (event) => {
      db = event.target.result as IDBDatabase;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result as IDBDatabase;

      if (!database.objectStoreNames.contains("data")) {
        const objectStore = database.createObjectStore("data", {
          keyPath: "id",
        });
        objectStore.createIndex("name", "name", { unique: false });
      }
    };
  });
}

/**
 * 获取对象存储区
 * @param {IDBDatabase} database - IndexedDB 数据库连接
 * @param {string} mode - 操作模式：readonly 或 readwrite
 */
export function getStore(
  database: IDBDatabase,
  mode: "readonly" | "readwrite"
): IDBObjectStore {
  const transaction = database.transaction(["data"], mode);
  const store = transaction.objectStore("data");
  return store;
}

/**
 * 添加数据到对象存储区
 * @param {Object} data - 要添加的数据对象
 */
export function addData(data: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const store = getStore(db, "readwrite");

      const request = store.add(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("添加数据出错"));
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 检索指定 ID 的数据对象
 * @param {number} id - 要检索的数据对象的 ID
 */
export function getData(id: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const store = getStore(db, "readonly");

      const request = store.get(id);

      request.onsuccess = (event) => {
        const data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          reject(new Error("找不到指定 ID 的数据"));
        }
      };

      request.onerror = () => {
        reject(new Error("检索数据出错"));
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 更新存储在对象存储区中的数据
 * @param {Object} data - 要更新的数据对象
 */
export function updateData(data: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const store = getStore(db, "readwrite");

      const request = store.put(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("更新数据出错"));
      };
    } catch (error) {
      reject(error);
    }
  });
}
