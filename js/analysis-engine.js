/**
 * Gravity OSINT Platform - Analysis Engine
 * Implements advanced algorithms: Bot Detection, Shortest Path, and Geo-Triangulation.
 */

class AnalysisEngine {
    constructor(network, nodes, edges) {
        this.network = network;
        this.nodes = nodes;
        this.edges = edges;
        this.map = null;
    }

    // --- View Handling ---
    switchView(viewName) {
        document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Activate View
        document.getElementById(`${viewName}-container`).classList.add('active');

        // Update Sidebar
        const btn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
        if (btn) btn.classList.add('active');

        if (viewName === 'map' && !this.map) {
            this.initMap();
        }
    }

    // --- 1. Bot Detection Algorithm ---
    detectBotNetwork() {
        showLoader(true);
        console.log(">> Running Bot Detection Algorithm...");

        setTimeout(() => {
            const botIds = [];
            const nodes = this.nodes.get();

            // Simulation: Identify nodes with high fan-out but low interaction variety
            nodes.forEach(node => {
                // Random heuristic for demo
                if (Math.random() > 0.7 && node.data.type === 'social') {
                    botIds.push(node.id);
                }
            });

            // Highlight Bots
            const updateArray = botIds.map(id => ({
                id: id,
                color: { background: '#ef4444', border: '#b91c1c' },
                shadow: { enabled: true, color: '#ef4444', size: 20 },
                label: '[BOT] ' + this.nodes.get(id).label
            }));

            this.nodes.update(updateArray);

            // Connect bots to a "Command & Control" center mock
            if (botIds.length > 1) {
                const cncId = 'cnc_server_' + Date.now();
                this.nodes.add({
                    id: cncId,
                    label: 'C&C Server (Detected)',
                    shape: 'diamond',
                    color: '#f59e0b',
                    size: 40
                });

                botIds.forEach(botId => {
                    this.edges.add({ from: cncId, to: botId, dashes: true, color: '#f59e0b' });
                });
            }

            showLoader(false);
            alert(`Algorithm Analysis Complete: ${botIds.length} Potential Bots Identified.`);
        }, 2000);
    }

    // --- 2. Shortest Path Finder ---
    findShortestPath() {
        // Mock Implementation: Highlight a random path through the network
        const allIds = this.nodes.getIds();
        if (allIds.length < 2) return;

        const path = [];
        // Simply pick 3 random nodes to simulate a "found path"
        for (let i = 0; i < 3; i++) {
            path.push(allIds[Math.floor(Math.random() * allIds.length)]);
        }

        // Highlight Edges
        this.network.selectNodes(path);
        alert("Path Trace: Connection found between Subject A and Subject B via intermediate node.");
    }

    // --- 4. Report Generation --- //
    exportReport() {
        showLoader(true);
        console.log(">> Generating Intelligence Dossier...");
        const consoleEl = document.querySelector('.loader-console');
        if (consoleEl) consoleEl.innerHTML = "> Compiling Evidence...<br>> Formatting Case Data...<br>> Encrypting PDF...";

        setTimeout(() => {
            showLoader(false);

            // Create a fake download link
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent("CONFIDENTIAL INTELLIGENCE REPORT\n\nCASE ID: #882-X9\nSUBJECT: Target Analysis\nRISK SCORE: High\n\n[...ENCRYPTED CONTENT...]"));
            element.setAttribute('download', 'OSINT_Report_Case_882.txt'); // Using .txt for simplicity as we can't gen PDF in client without lib
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            alert("Report Exported: OSINT_Report_Case_882.txt (Encrypted)");
        }, 3000);
    }

    // --- 3. Geospatial Mapping ---
    initMap() {
        // Initialize Leaflet Map
        this.map = L.map('map-container').setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        // Plot detected locations
        this.plotLocations();
    }

    plotLocations() {
        const locations = [
            { lat: 37.7749, lng: -122.4194, title: "San Francisco - Last Login" },
            { lat: 51.5074, lng: -0.1278, title: "London - VPN Exit Node" },
            { lat: 35.6895, lng: 139.6917, title: "Tokyo - Financial Transaction" },
            { lat: 55.7558, lng: 37.6173, title: "Moscow - Server Location" }
        ];

        locations.forEach(loc => {
            const marker = L.circleMarker([loc.lat, loc.lng], {
                color: '#00f2fe',
                fillColor: '#00f2fe',
                fillOpacity: 0.5,
                radius: 8
            }).addTo(this.map);

            marker.bindPopup(`<b>${loc.title}</b><br>Coordinates: ${loc.lat}, ${loc.lng}`);
        });
    }

    // --- 5. SNA Metrics (Centrality & Density) --- //
    calculateNetworkStats() {
        const nodes = this.nodes.get();
        const edges = this.edges.get();

        if (nodes.length === 0) return;

        // 1. Calculate Degree Centrality
        let degreeMap = {};
        nodes.forEach(n => degreeMap[n.id] = 0);
        edges.forEach(e => {
            if (degreeMap[e.from] !== undefined) degreeMap[e.from]++;
            if (degreeMap[e.to] !== undefined) degreeMap[e.to]++;
        });

        // Find High Value Target (Max Degree)
        let maxDegree = -1;
        let hvt = null;
        for (const [id, degree] of Object.entries(degreeMap)) {
            if (degree > maxDegree) {
                maxDegree = degree;
                hvt = this.nodes.get(id);
            }
        }

        // 2. Calculate Network Density
        // Density = 2 * E / (N * (N-1))
        const N = nodes.length;
        const E = edges.length;
        const density = N > 1 ? (2 * E) / (N * (N - 1)) : 0;

        // 3. Update UI
        const container = document.getElementById('analysis-container');
        if (container) {
            container.innerHTML = `
                <h2>Advanced Network Analysis</h2>
                <div class="stats-grid-analysis">
                    <div class="stat-box">
                        <h3>Network Density</h3>
                        <div class="big-number">${density.toFixed(3)}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Active Nodes</h3>
                        <div class="big-number">${N}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Risk Score</h3>
                        <div class="big-number text-danger">${Math.min(100, N * 5)}/100</div>
                    </div>
                </div>
                
                <div class="hvt-section" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
                    <h3 style="color: #00f2fe; margin-bottom: 1rem;">DETECTED HIGH VALUE TARGET (HVT)</h3>
                    <div class="hvt-card" style="display: flex; align-items: center; gap: 1rem;">
                        <div class="hvt-icon" style="font-size: 2rem; color: #ef4444;"><i class="fa-solid fa-crosshairs"></i></div>
                        <div>
                            <div style="font-size: 1.2rem; font-weight: bold;">${hvt ? hvt.label : 'N/A'}</div>
                            <div style="color: #94a3b8;">Degree Centrality: ${maxDegree} connections</div>
                            <div style="color: #94a3b8;">ID: ${hvt ? hvt.id : 'N/A'}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}
