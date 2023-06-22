'use strict';

const STORAGE_TOKEN = 'HSIBTGH20R249CK7L0TNQWU9RPAZCFUZDFDKHTF8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Sets an item in the remote storage.
 * @param {String} key Name of the Key.
 * @param {Object[]} value Object with information to store.
 * @returns {Promise<Response>} Fetch response.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json())
        .catch(error => {
            console.warn(`${key} could not be set.`);
            console.error(error);
        });
}

/**
 * Gets the items from the remote storage.
 * @param {String} key Name of the Key.
 * @returns {JSON} Fetch response.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
        .then(res => res.json())
        .then(res => JSON.parse(convertToJson(res.data.value)))
        .catch(error => {
            console.warn(`${key} could not be fetched.`);
            console.error(error);
            return [];
        });
}

/**
 * Convertrs the JSON string from the remote storage to a valid JSON string.
 * @param {String} string String that should be converted.
 * @returns {String} Converted string.
 */
function convertToJson(string) {
    return string.replace(/{'|'}|': '|', '|':|'}/g, match => {
        switch (match) {
            case "{'": return '{"';
            case "'}": return '"}';
            case "': '": return '": "';
            case "', '": return '", "';
            case "':": return '":';
        }
    });
}

/**
 * Stores the users array in the local storage.
 * @param {User[]} users Array of user.
 * @returns {JSON} setItem response.
 */
export async function storeUser(users) {
    return await setItem('users', users);

}

/**
 * Gets the users array from the local storage.
 * @returns {JSON} getItem response.
 */
export async function loadUser() {
    return await getItem('users');
}

/**
 * Finds and returns a user of the users array.
 * @param {User[]} users Array of users.
 * @param {String} email Email of the user.
 * @returns {User[]} Found users (can only be 1).
 */
export function findUser(users, email) {
    return users?.filter(user => user.email === email);
}

/**
 * Stores the contacts array in the local storage.
 * @param {User[]} contacts Array of contacts.
 * @returns {JSON} setItem response.
 */
export async function storeContacts(contacts) {
    return await setItem('contacts', contacts);

}

/**
 * Gets the contacts array from the local storage.
 * @returns {JSON} getItem response.
 */
export async function loadContacts() {
    return await getItem('contacts');
}

/**
 * Stores the tasks array in the local storage.
 * @param {User[]} tasks Array of tasks.
 * @returns {JSON} setItem response.
 */
export async function storeTasks(tasks) {
    return await setItem('tasks', tasks);

}

/**
 * Gets the tasks array from the local storage.
 * @returns {JSON} getItem response.
 */
export async function loadTasks() {
    return await getItem('tasks');
}