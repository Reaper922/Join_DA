'use strict';

import { storeUser, loadUser, findUser } from './storage.js';
import { notify } from './notification.js';


let users = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    addSignUpFormEventListener();
    addInputEventListener();
    users = await loadUser();
}

/**
 * Add the submit event listener to the form element and validates the input fields on submit.
 */
function addSignUpFormEventListener() {
    const signUpFormEl = document.getElementById('submit-sign-up');

    signUpFormEl?.addEventListener('submit', event => validateInputFields(event, event.target));
}

/**
 * Adds the focusout and invalid event listener to the input fields
 */
function addInputEventListener() {
    const inputElements = ['name', 'email', 'password'];

    inputElements.forEach(element => {
        const inputEl = document.getElementById(`login-${element}`);

        inputEl?.addEventListener('focusout', () => {
            setWarnVisibility(element, false);
            validateElementValue(inputEl);
        });

        inputEl?.addEventListener('invalid', event => {
            event.preventDefault();
            setWarnVisibility(element, true);
        });
    });
}

/**
 * Validates the input fields and checks if the user is already registered.
 * @param {SubmitEvent} event Form submit event.
 * @param {HTMLElement[]} inputElements Array of the input elements.
 * @returns {void}
 */
function validateInputFields(event, [usernameEl, emailEl, passwordEl]) {
    event.preventDefault();

    const isUsernameValid = validateElementValue(usernameEl);
    const isEmailValid = validateElementValue(emailEl);
    const isPasswordValid = validateElementValue(passwordEl);
    const isAlreadyRegistered = checkUserRegistration(emailEl.value);

    if (isAlreadyRegistered) {
        infoAlreadyRegistered(emailEl);
        return
    }
    if (isUsernameValid && isEmailValid && isPasswordValid) registerUser([usernameEl, emailEl, passwordEl]);
}

/**
 * Validates the input of the given element.
 * @param {HTMLElement} element Input field element.
 * @returns {Boolean} Boolean if the input of the element is valid.
 */
function validateElementValue(element) {
    let isValid = false;
    element.setCustomValidity(true);

    switch (element.id) {
        case 'login-name':
            isValid = element.value.length >= 2;
            element.setCustomValidity(false);
            break;
        case 'login-email':
            setEmailWarnText('Please enter a valid email address.');
            isValid = Boolean(element.value.match(/^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/g));
            element.setCustomValidity(false);
            break;
        case 'login-password':
            isValid = element.value.length > 5;
            element.setCustomValidity(false);
            break;
    }

    if (!isValid) element.reportValidity();
    return isValid;
}

/**
 * Sets the visibility of the warn element.
 * @param {String} name Name of the warn element.
 * @param {Boolean} isVisible Boolean if the element is visible.
 */
function setWarnVisibility(name, isVisible) {
    const warnEl = document.getElementById(`login-${name}-warn`);

    warnEl.style.display = isVisible ? 'inline' : 'none';
}

/**
 * Sets the text of the email warn element.
 * @param {String} text Text to be displayed by the email warn element.
 */
function setEmailWarnText(text) {
    const emailWarnEl = document.getElementById('login-email-warn');

    emailWarnEl.innerText = text;
}

/**
 * Checks if the user is already registered.
 * @param {String} email Email adress of the new user.
 * @returns {Boolean} Boolean if the user is already registered.
 */
function checkUserRegistration(email) {
    const existingUser = findUser(users, email);
    return Boolean(existingUser?.length);
}

/**
 * Inform the user, that the email is already registered.
 * @param {HTMLElement} emailEl Email input field.
 */
function infoAlreadyRegistered(emailEl) {
    setEmailWarnText('This email is already registered!');
    emailEl.setCustomValidity(false);
    emailEl.reportValidity();
}

/**
 * Registers a the new user and stores him in the users array and database.
 * @param {HTMLElement[]} inputElements Array of the input elements.
 */
function registerUser(inputElements) {
    users.push(createUser(inputElements));
    storeUser(users);
    clearInputFields(inputElements);
    notify('User successfully registered.');
}

/**
 * Creates a new user object with the values from the input fields.
 * @param {HTMLElement[]} inputElements Array of the input elements.
 * @returns {Object} New user object.
 */
function createUser([usernameEl, emailEl, passwordEl]) {
    return {
        username: usernameEl.value,
        email: emailEl.value,
        password: passwordEl.value
    }
}

/**
 * Clears the text value from the input fields.
 * @param {HTMLElement[]} inputElements Array of the input elements.
 */
function clearInputFields(inputElements) {
    inputElements?.forEach(element => element.value = '');
}


init();