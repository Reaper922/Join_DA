'use strict';

window.onload = () => {
    includeHTML();
    if (window.location.pathname === '/index.html') { buttonEventListener() }
}


async function includeHTML() {
    const includeElements = document.querySelectorAll('[template-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("template-html");
        const resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function buttonEventListener() {
    const signupBtn = document.getElementById('signup');
    const loginBtn = document.getElementById('login');
    const guestLoginBtn = document.getElementById('guest-login');

    signupBtn.addEventListener('click', () => {
        window.location.href = 'sign-up.html';
    });

    loginBtn.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'summary.html';
    });

    guestLoginBtn.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'summary.html';
    });
}
