/**
 * Gravity OSINT - Cyber Feed Simulation
 * Simulates a live stream of intercepted data packets
 */

class CyberFeed {
    constructor() {
        this.feeds = [
            { src: 'TOR_EXIT', msg: 'Encrypted traffic detected to 88.192.x.x' },
            { src: 'PASTEBIN', msg: 'New leak detected: "db_dump_users_v2.sql"' },
            { src: 'TELEGRAM', msg: 'Channel "DarkMarket" posted new malware sample' },
            { src: 'IDS_ALERT', msg: 'Port scan detected from 192.168.1.105', type: 'alert' },
            { src: 'BLOCKCHAIN', msg: 'Large TC transfer: 500 BTC -> Wallet 0x9a...' },
            { src: 'SHODAN', msg: 'New vulnerable device found: Industrial Controller (Siemens)' },
            { src: 'DARK_FORUM', msg: 'User "Viper" is online' }
        ];
        this.container = document.getElementById('feed-content');
        this.running = true;
        this.start();
    }

    start() {
        if (!this.container) return;
        this.addLine(">> SYSTEM: INTERCEPTION PROTOCOL ACTIVE...");

        setInterval(() => {
            if (!this.running) return;
            this.emitRandomPacket();
        }, 1500); // New line every 1.5s
    }

    emitRandomPacket() {
        const packet = this.feeds[Math.floor(Math.random() * this.feeds.length)];
        const ip = Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + ".x.x";
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });

        const line = document.createElement('div');
        line.className = 'feed-line';
        if (packet.type === 'alert') line.classList.add('alert');

        line.innerHTML = `
            <span class="timestamp">[${time}]</span>
            <span class="source">${packet.src}</span>
            <span class="ip">${ip}</span>
            <span class="msg">${packet.msg}</span>
        `;

        this.container.prepend(line);

        // Limit history
        if (this.container.children.length > 20) {
            this.container.removeChild(this.container.lastChild);
        }
    }

    toggle() {
        this.running = !this.running;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    window.cyberFeed = new CyberFeed();
});

window.toggleFeed = () => {
    window.cyberFeed.toggle();
    const btn = document.querySelector('.console-controls i');
    btn.classList.toggle('fa-pause');
    btn.classList.toggle('fa-play');
};
