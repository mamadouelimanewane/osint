/**
 * Gravity OSINT - Network Mapper (Nmap/ARP)
 * Parses system output and updates the graph with discovered devices.
 */

window.scanNetwork = async () => {
    showLoader(true);
    const consoleEl = document.getElementById('terminal-output');

    // Simulate initial scan message
    window.sysTerminal.print(">> INITIALIZING NETWORK PROBE...");
    window.sysTerminal.print(">> MODE: ACTIVE DISCOVERY (NMAP/ARP)");

    try {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'scan_network', target: '192.168.1.0/24' })
        });

        const data = await response.json();
        const rawOutput = data.output;

        window.sysTerminal.print(rawOutput);

        // Parse ARP/Nmap Output to Graph
        const ips = rawOutput.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g) || [];
        const uniqueIPs = [...new Set(ips)];

        alert(`NETWORK SCAN COMPLETE: Found ${uniqueIPs.length} Active Devices.`);

        const gatewayId = 'gateway_' + Date.now();
        appState.nodes.add({
            id: gatewayId, label: 'Local Network Gateway', shape: 'diamond', color: '#ff00ff', size: 30
        });

        uniqueIPs.forEach((ip, idx) => {
            const devId = 'dev_' + ip;
            appState.nodes.add({
                id: devId,
                label: ip,
                shape: 'dot',
                color: { background: '#00ff00', border: '#fff' },
                data: { type: 'device', value: ip, risk: 'LOW' }
            });
            appState.edges.add({ from: gatewayId, to: devId });
        });

    } catch (e) {
        window.sysTerminal.print("Error: Scan Failed. Ensure Server is Running.", 'error');
    }

    showLoader(false);
};
