// for saving and retrieving results
export const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("QuizDB", 1)

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains("results")) {
                db.createObjectStore("results", { keyPath: "id", autoIncrement: true })
            }
        }

        request.onerror = (e) => {
            reject("Error opening database: " + e.target.errorCode)
        }

        request.onsuccess = (e) => {
            resolve(e.target.result)
        }
    })
}

export const saveResult = (db, result) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("results", "readwrite")
        const store = transaction.objectStore("results")

        const request = store.add(result)

        request.onsuccess = () => {
            resolve("Result saved successfully!")
        }

        request.onerror = (e) => {
            reject("Error saving result: " + e.target.errorCode)
        }
    })
}

export const getResults = (db) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("results", "readonly")
        const store = transaction.objectStore("results")

        const request = store.getAll()

        request.onsuccess = (e) => {
            resolve(e.target.result)
        };

        request.onerror = (e) => {
            reject("Error retrieving results: " + e.target.errorCode)
        };
    });
};
