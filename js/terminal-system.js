/**
 * Gravity OSINT - System Terminal Uplink
 * Handles communication between UI and Python Backend.
 * Allows execution of 'ping', 'tracert', 'nslookup' from browser.
 */

class SystemTerminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.status = document.querySelector('.live-badge');

        if (this.input) {
            this.input.addEventListener('keypress', (e) => this.handleCommand(e));
        }

        this.checkStatus();
    }

    async checkStatus() {
        try {
            const res = await fetch('/api/heartbeat');
            if (res.ok) {
                this.status.innerHTML = '● SYSTEM ONLINE (REAL-TIME ENABLED)';
                this.status.style.color = '#10b981';
            } else {
                throw new Error();
            }
        } catch (e) {
            this.status.innerHTML = '● SIMULATION MODE (LOCAL SERVER OFFLINE)';
            this.status.style.color = '#f59e0b';
            setTimeout(() => {
                this.print(">> NOTICE: Local Python server not detected.", 'warning');
                this.print(">> Real network commands (Ping/Nmap) and Case Saving are disabled.", 'warning');
                this.print(">> To enable full power, run START_SYSTEM.bat from your local machine.", 'warning');
            }, 1000);
        }
    }

    async handleCommand(e) {
        if (e.key !== 'Enter') return;

        const raw = this.input.value.trim();
        this.input.value = '';
        if (!raw) return;

        const parts = raw.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1];

        this.print(`root@gravity:~$ ${raw}`);

        if (['ping', 'nslookup', 'tracert'].includes(cmd)) {
            if (!arg) {
                this.print(`Error: ${cmd} requires a target (IP or Domain)`);
                return;
            }
            this.executeRemote(cmd, arg);
        } else if (cmd === 'clear') {
            this.output.innerHTML = '';
        } else if (cmd === 'help') {
            this.print(`
Available Commands:
  ping <target>       - Check host availability
  nslookup <target>   - Resolve domain names
  tracert <target>    - Trace route to host
  clear               - Clear terminal
            `);
        } else {
            this.print(`Command not found: ${cmd}`);
        }
    }

    async executeRemote(cmd, target) {
        this.print(`[SYSTEM] Executing ${cmd} on ${target}... (Please wait)`);

        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmd, target: target })
            });

            if (!response.ok) throw new Error("Server Error");

            const data = await response.json();

            if (data.status === 'success') {
                this.print(data.output, 'success');
            } else {
                this.print(`Error: ${data.output}`, 'error');
            }
        } catch (e) {
            this.print("Connection Error: Python Server Offline. Use 'launch_platform.bat'", 'error');
        }
    }

    print(text, type = '') {
        const line = document.createElement('div');
        line.className = `term-line ${type}`;
        line.innerText = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    window.sysTerminal = new SystemTerminal();
});
