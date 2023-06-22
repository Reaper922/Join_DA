'use strict';

import { loadUser, findUser, storeUser } from './storage.js';


let users = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    addLoginFormEventListener();
    addSignUpBtnEventListener();
    addGuestLoginBtnEventListener();
    loadRememberedUser();
    users = await loadUser();
}

/**
 * Add the submit event listener to the form element and checks if the user can be logged in on submit.
 */
function addLoginFormEventListener() {
    const loginFormEl = document.getElementById('submit-login');

    loginFormEl.addEventListener('submit', event => checkLogin(event, event.target));
}

/**
 * Add a click event listener to the sign up button and forwards the user to the sign up page on click.
 */
function addSignUpBtnEventListener() {
    const signUpBtn = document.getElementById('sign-up');

    signUpBtn.addEventListener('click', () => location.pathname = '/sign-up.html');
}

/**
 * Add a click event listener to the guest login button and loggs in the guest.
 */
function addGuestLoginBtnEventListener() {
    const guestLoginBtn = document.getElementById('guest-login');

    guestLoginBtn.addEventListener('click', loginGuest);
}

/**
 * User login validation flow.
 * @param {SubmitEvent} event Form submit event.
 * @param {HTMLElement[]} inputElements Array of the input elements. 
 */
function checkLogin(event, [emailEl, passwordEl]) {
    event.preventDefault();

    const userArr = findUser(users, emailEl.value);
    const isCredentialsValid = validateCredentials(userArr[0], passwordEl);

    if (isCredentialsValid) {
        setWarnVisibility(false);
        setRememberedUser(userArr[0]);
        loginUser(userArr[0]);
    } else {
        setWarnVisibility(true);
    }
}

/**
 * Validates the user credentials.
 * @param {Object} user Object of the logged in user.
 * @param {HTMLElement} passwordEl Element of the password input. 
 * @returns {Boolean} Boolean if the credentials are correct.
 */
function validateCredentials(user, passwordEl) {
    if (!user) return false;
    return user.password === passwordEl.value;
}


/**
 * Sets the visibility of the email warn element.
 * @param {Boolean} isVisible Boolean if the element is visible.
 */
function setWarnVisibility(isVisible) {
    const warnEl = document.getElementById(`login-email-warn`);

    warnEl.style.display = isVisible ? 'inline' : 'none';
}

/**
 * Stores the email of the remembered user in local storage if the checkbox is checked.
 * @param {Object} user Object of the logged in user.
 */
function setRememberedUser(user) {
    const rememberMeEl = document.getElementById('remember-me');

    if (rememberMeEl.checked) {
        localStorage.setItem('Join_remembered_user', user.email);
    } else {
        localStorage.removeItem('Join_remembered_user');
    }
}

/**
 * Loads the remembered user and prefills the input field with his email.
 */
function loadRememberedUser() {
    const loginInputEl = document.getElementById('login-email');
    const rememberMeEl = document.getElementById('remember-me');
    const rememberedUser = localStorage.getItem('Join_remembered_user');
    
    if (rememberedUser) {
        loginInputEl.value = rememberedUser;
        rememberMeEl.checked = true;
    }
}

/**
 * Logs the user in and redirects him to the summary page.
 * @param {Object} user Object of the logged in user.
 */
function loginUser(user) {
    localStorage.setItem('Join_current_user', user.username);
    location.pathname = '/summary.html';
}

/**
 * Logs the guest user in and redirects him to the summary page.
 */
function loginGuest() {
    localStorage.setItem('Join_current_user', 'Guest');
    location.pathname = '/summary.html';
}


init();