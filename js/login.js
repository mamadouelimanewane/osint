/**
 * Gravity OSINT Secure Login Simulation
 * Handles input simulation, MFA flow, and secure redirection.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const statusMsg = document.getElementById('status-msg');
    const mfaSection = document.getElementById('mfa-section');
    const btn = document.querySelector('.btn-login');

    let stage = 'credentials'; // stages: 'credentials', 'mfa', 'success'

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (stage === 'credentials') {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            if (user && pass) {
                simulateAuthentication();
            } else {
                statusMsg.textContent = "_ERROR: FIELDS MISSING";
                statusMsg.classList.add('error');
            }
        } else if (stage === 'mfa') {
            verifyMFA();
        }
    });

    function simulateAuthentication() {
        statusMsg.textContent = "_ENCRYPTING HANDSHAKE...";
        btn.disabled = true;
        btn.style.opacity = '0.5';

        setTimeout(() => {
            statusMsg.textContent = "_VALIDATING CREDENTIALS...";
        }, 1000);

        setTimeout(() => {
            statusMsg.textContent = "_2FA REQUIRED. ENTER TOKEN.";
            statusMsg.classList.remove('blink');
            mfaSection.classList.remove('hidden');
            form.querySelector('.input-group').style.display = 'none'; // Hide first step
            form.querySelectorAll('.input-group')[1].style.display = 'none';

            stage = 'mfa';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.querySelector('.btn-text').textContent = "VERIFY TOKEN";

            // Auto focus MFA
            const box = document.querySelector('.mfa-digit');
            if (box) box.focus();
        }, 2500);
    }

    // Handle MFA Inputs (Auto-advance)
    const inputs = document.querySelectorAll('.mfa-digit');
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (input.value.length === 1) {
                if (index < inputs.length - 1) inputs[index + 1].focus();
                else btn.click(); // Auto-submit on last digit
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    function verifyMFA() {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ACCESSING...';
        statusMsg.textContent = "_VALIDATING BIOMETRIC LINK...";

        setTimeout(() => {
            statusMsg.textContent = "_ACCESS GRANTED.";
            statusMsg.style.color = '#10b981';
            document.querySelector('.login-card').style.borderColor = '#10b981';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 2000);
    }
});
