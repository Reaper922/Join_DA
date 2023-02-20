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


if (location.pathname === '/index.html' || location.pathname === '/') { buttonEventListener() }