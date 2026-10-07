// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

    // Toggle Password Visibility (Helper Function)
    function attachPasswordToggle(toggleBtnId, inputId, iconId) {
        const toggleBtn = document.getElementById(toggleBtnId);
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function (e) {
                const passwordInput = document.getElementById(inputId);
                const eyeIcon = document.getElementById(iconId);
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.classList.remove('fa-eye');
                    eyeIcon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.classList.remove('fa-eye-slash');
                    eyeIcon.classList.add('fa-eye');
                }
            });
        }
    }

    attachPasswordToggle('toggle-password', 'password', 'eye-icon');
    attachPasswordToggle('toggle-confirm-password', 'confirm-password', 'eye-icon-confirm');

    // Simulate Forgot Password
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email').value;
            const resetAlert = document.getElementById('reset-alert');
            const loginError = document.getElementById('login-error');
            loginError.style.display = 'none';
            
            if (!emailInput) {
                loginError.querySelector('span').innerText = 'Please enter your email address to reset password.';
                loginError.style.display = 'flex';
                return;
            }
            
            // Show alert message
            resetAlert.innerHTML = `<i class="fa-solid fa-check-circle"></i> Password reset link sent to ${emailInput}`;
            resetAlert.style.display = 'flex';
            
            // Hide after 5 seconds
            setTimeout(() => {
                resetAlert.style.display = 'none';
            }, 5000);
        });
    }

    // Handle Login Form Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginError = document.getElementById('login-error');
            
            if (!email || !password) {
                loginError.querySelector('span').innerText = 'Please fill out all fields.';
                loginError.style.display = 'flex';
                return;
            }
            
            loginError.style.display = 'none';
            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...';
            btn.disabled = true;

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // Handle Register Form Submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const registerError = document.getElementById('register-error');
            
            if (!name || !email || !password || !confirmPassword) {
                registerError.querySelector('span').innerText = 'Please fill out all fields.';
                registerError.style.display = 'flex';
                return;
            }
            
            if (password !== confirmPassword) {
                registerError.querySelector('span').innerText = 'Passwords do not match.';
                registerError.style.display = 'flex';
                return;
            }
            
            registerError.style.display = 'none';
            const btn = registerForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...';
            btn.disabled = true;

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }
});
