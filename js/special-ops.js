/**
 * Gravity OSINT - Special Operations Module
 * Handles Start-Grade capabilities: Biometrics, Decryption, and GSM Triangulation.
 */

class SpecialOps {
    constructor() {
        this.overlay = null;
    }

    // --- 1. Biometric Scan Simulation ---
    initiateFaceScan(targetName) {
        this.createOverlay('BIOMETRIC_SCAN');

        const content = this.overlay.querySelector('.ops-content');
        content.innerHTML = `
            <div class="bio-scan-container">
                <div class="bio-target">
                    <img src="https://ui-avatars.com/api/?name=${targetName}&size=200&background=random" class="target-img">
                    <div class="scan-grid"></div>
                    <div class="scan-line"></div>
                </div>
                <div class="bio-status">
                    <div class="status-line">> INITIALIZING NEURAL NET...</div>
                    <div class="status-line">> EXAMINING 128 FACIAL POINTS...</div>
                    <div class="status-line blink">> SEARCHING INTERPOL ARCHIVES...</div>
                </div>
                <div class="bio-matches hidden">
                    <h3>MATCHES FOUND (98.4%)</h3>
                    <div class="match-row">
                        <img src="https://ui-avatars.com/api/?name=${targetName}&background=000&color=fff" width="40">
                        <div>
                            <div>ID_PASSPORT_88291</div>
                            <small>Source: Border Control DB</small>
                        </div>
                    </div>
                    <div class="match-row">
                        <img src="https://ui-avatars.com/api/?name=${targetName}&background=333&color=fff" width="40">
                        <div>
                            <div>CCTV_LONDON_CAM_4</div>
                            <small>Source: Public Surveillance</small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Sequence
        setTimeout(() => this.logStatus('> ANALYZING JAWLINE GEOMETRY...'), 1000);
        setTimeout(() => this.logStatus('> RETINAL PATTERN MATCHED...'), 2000);
        setTimeout(() => {
            document.querySelector('.bio-matches').classList.remove('hidden');
            document.querySelector('.scan-line').style.background = '#10b981';
            this.logStatus('> POSITIVE IDENTIFICATION CONFIRMED.', 'success');
        }, 3500);
    }

    // --- 2. PGP Decryption Simulation ---
    initiateDecryption(encryptedText) {
        this.createOverlay('DECRYPTION_MODULE');
        const content = this.overlay.querySelector('.ops-content');

        content.innerHTML = `
            <div class="decrypt-terminal">
                <div class="hash-stream">
                    ${this.generateHashBlock()}
                </div>
                <div class="decrypt-progress">
                    <div class="progress-bar"><div class="fill"></div></div>
                    <div class="progress-text">BRUTE-FORCING: 0%</div>
                </div>
                <div class="decrypt-result hidden">
                    <h4>DECRYPTED MESSAGE:</h4>
                    <p class="clear-text">"MEET AT SAFE HOUSE ALPHA. BRING THE LEDGER. 22:00 UTC."</p>
                </div>
            </div>
        `;

        // Animation
        const fill = content.querySelector('.fill');
        const text = content.querySelector('.progress-text');
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 100) progress = 100;

            fill.style.width = `${progress}%`;
            text.innerText = `BRUTE-FORCING: ${Math.floor(progress)}%`;

            // Randomize Hashes
            content.querySelector('.hash-stream').innerText = this.generateHashBlock();

            if (progress === 100) {
                clearInterval(interval);
                content.querySelector('.decrypt-result').classList.remove('hidden');
                text.innerText = "KEY FOUND: RSA-4096 [CRACKED]";
                text.style.color = '#10b981';
            }
        }, 100);
    }

    // --- Helper UI ---
    createOverlay(title) {
        // Remove existing
        const existing = document.getElementById('ops-overlay');
        if (existing) existing.remove();

        this.overlay = document.createElement('div');
        this.overlay.id = 'ops-overlay';
        this.overlay.className = 'ops-modal-overlay';
        this.overlay.innerHTML = `
            <div class="ops-modal glass-card">
                <div class="ops-header">
                    <h3><i class="fa-solid fa-microchip"></i> ${title}</h3>
                    <button onclick="window.specialOps.close()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="ops-content"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);

        // Trigger reflow for animation
        setTimeout(() => this.overlay.classList.add('active'), 10);
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => this.overlay.remove(), 300);
        }
    }

    logStatus(msg, type = '') {
        const container = document.querySelector('.bio-status');
        if (container) {
            const div = document.createElement('div');
            div.className = 'status-line ' + type;
            div.innerText = msg;
            container.appendChild(div);
        }
    }

    generateHashBlock() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let str = "";
        for (let i = 0; i < 200; i++) str += chars.charAt(Math.floor(Math.random() * chars.length));
        return str.match(/.{1,40}/g).join('\n');
    }
}

// Global Init
document.addEventListener('DOMContentLoaded', () => {
    window.specialOps = new SpecialOps();
});

// Exposed Global Functions
window.runBiometrics = (name) => window.specialOps.initiateFaceScan(name);
window.runDecryption = () => window.specialOps.initiateDecryption();
