/**
 * Gravity OSINT Platform - Core Logic
 * Handles graph initialization, search execution, and data simulation.
 */

// Global State
const appState = {
    network: null,
    nodes: new vis.DataSet([]),
    edges: new vis.DataSet([]),
    selectedNode: null,
    engine: null // Analysis Engine Instance
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initGraph();
    initSearchHandler();
    initPanelHandler();

    // Initialize Analysis Engine
    appState.engine = new AnalysisEngine(appState.network, appState.nodes, appState.edges);

    // Initial Demo Data
    console.log("System Initialized. Ready for queries.");
});

// --- UI Handlers ---
window.switchView = (view) => {
    // Hide all panels
    const viewRef = document.getElementById('view-container').querySelectorAll('.view-panel');
    viewRef.forEach(el => el.classList.remove('active'));

    // Show target
    document.getElementById(`${view}-container`).classList.add('active');

    // Init Map if needed
    if (view === 'map' && appState.engine) {
        if (!appState.engine.map) appState.engine.initMap();
        else setTimeout(() => appState.engine.map.invalidateSize(), 200); // Leaflet quirk fix
    }

    // Init Analysis if needed
    if (view === 'analysis' && appState.engine) {
        appState.engine.calculateNetworkStats();
    }

    // Toggle Nav Active State
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(view)) btn.classList.add('active');
    });
};

window.exportReport = () => {
    if (appState.engine) appState.engine.exportReport();
};

window.executeAlgorithm = (algoName) => {
    if (!appState.engine) return;

    if (algoName === 'bot_detection') appState.engine.detectBotNetwork();
    else if (algoName === 'shortest_path') appState.engine.findShortestPath();
};

// --- Graph Engine (Vis.js) ---
function initGraph() {
    const container = document.getElementById('graph-container');

    const data = {
        nodes: appState.nodes,
        edges: appState.edges
    };

    const options = {
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 14,
                color: '#f1f5f9',
                face: 'Inter'
            },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            width: 1,
            color: { color: '#334155', highlight: '#00f2fe' },
            smooth: { type: 'continuous' }
        },
        physics: {
            stabilization: false,
            barnesHut: {
                gravitationalConstant: -3000,
                springConstant: 0.04,
                springLength: 95
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200
        }
    };

    appState.network = new vis.Network(container, data, options);

    // Event Listeners
    appState.network.on('click', (params) => {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const nodeData = appState.nodes.get(nodeId);
            showEntityDetails(nodeData);
        } else {
            hideEntityDetails();
        }
    });

    // Double-click to open real links
    appState.network.on('doubleClick', (params) => {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const node = appState.nodes.get(nodeId);
            if (node.data && node.data.url) {
                window.open(node.data.url, '_blank');
            }
        }
    });

    // Cursor pointer on hover
    appState.network.on("hoverNode", function () {
        container.style.cursor = 'pointer';
    });
    appState.network.on("blurNode", function () {
        container.style.cursor = 'default';
    });
}

// --- Search Logic & Data Simulation ---
window.executeSearch = (queryOverride, typeOverride) => {
    const searchInput = document.getElementById('main-search');
    const searchType = document.querySelector('.search-type');

    const query = queryOverride || searchInput.value.trim();
    const type = typeOverride || searchType.value;

    if (!query) return;

    if (!queryOverride) searchInput.value = query; // Sync UI

    showLoader(true);

    // Simulate API delay
    setTimeout(() => {
        const rootId = 'root_' + Date.now();

        // Add Root Node
        appState.nodes.add({
            id: rootId,
            label: query,
            group: 'target',
            color: { background: '#ef4444', border: '#fca5a5' },
            size: 30,
            data: {
                type: type,
                value: query,
                source: 'Manual Entry'
            }
        });

        // Simulate finding related entities (The "OSINT" Magic)
        simulateDiscovery(rootId, type, query);

        showLoader(false);
        appState.network.fit();
    }, 1200);
};

function initSearchHandler() {
    const searchBtn = document.getElementById('btn-search');
    const searchInput = document.getElementById('main-search');

    searchBtn.addEventListener('click', () => window.executeSearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.executeSearch();
    });
}

// --- Mock Data Generator (The Fake API) ---
async function simulateDiscovery(parentId, type, query) {
    // 1. SCENARIO MODE: "OPERATION CHIMERA"
    if ((query && query.toLowerCase() === 'chimera') || (appState.nodes.get(parentId)?.group === 'chimera')) {
        handleChimeraScenario(parentId);
        return;
    }

    // 2. REAL OSINT: Check if input is an IP Address (IPv4 Regex)
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (query && ipRegex.test(query)) {
        showLoader(true);
        const data = await window.realOSINT.lookupIP(query);
        showLoader(false);

        if (data) {
            // Found real IP! Add Location Node
            const locId = `loc_${Date.now()}`;
            appState.nodes.add({
                id: locId,
                label: `[REAL] ${data.city}, ${data.country}`,
                shape: 'dot',
                color: { background: '#10b981', border: '#fff' }, // Green for Real Data
                font: { color: '#10b981' },
                data: {
                    type: 'location',
                    value: `${data.city}, ${data.country}`,
                    details: `ISP: ${data.isp}\nLat/Lon: ${data.lat}, ${data.lon}`
                }
            });
            appState.edges.add({ from: parentId, to: locId, label: 'hosted_in', color: '#10b981' });

            // Add Map Marker if Engine is ready
            if (appState.engine && appState.engine.map) {
                L.marker([data.lat, data.lon]).addTo(appState.engine.map)
                    .bindPopup(`<b>${data.query}</b><br>${data.isp}<br>${data.city}`).openPopup();
                appState.engine.map.setView([data.lat, data.lon], 10);
            }
            return; // Stop here for real IP
        }
    }

    // 3. REAL OSINT: Generate "Dork" Links for generic search
    if (type === 'person' || type === 'email' || type === 'username') {
        const dorks = window.realOSINT.generateDorks(query || appState.nodes.get(parentId).label);
        // Add 1-2 random dork nodes to simulate focused search
        const dork = dorks[Math.floor(Math.random() * dorks.length)];
        const dorkId = `dork_${Date.now()}`;

        appState.nodes.add({
            id: dorkId,
            label: `Search: ${dork.label}`,
            shape: 'box',
            color: { background: '#3b82f6', border: '#fff' },
            font: { color: 'white' },
            data: { type: 'link', url: dork.url, value: dork.label }
        });
        appState.edges.add({ from: parentId, to: dorkId, label: 'public_source', dashes: true });
    }

    // 4. RANDOM MODE (Fallback / Filler)
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
        const nodeId = `node_${Date.now()}_${i}`;
        let mockData = generateMockEntity(type);
        appState.nodes.add({
            id: nodeId, label: mockData.label, shape: 'dot', color: mockData.color, data: mockData.data
        });

        appState.edges.add({ from: parentId, to: nodeId, label: mockData.relation });
    }
}

// --- SCENARIO DATA IMPLEMENTATION ---
function handleChimeraScenario(parentId) {
    const parentNode = appState.nodes.get(parentId);
    let newNodes = [];

    // Level 1: Initial Search "Chimera"
    if (!parentNode || parentNode.label.toLowerCase() === 'chimera') {
        newNodes = [
            { id: 'chimera_boss', label: 'X (The Architect)', type: 'person', color: '#ef4444', icon: 'user-secret', relation: 'leader' },
            { id: 'chimera_finance', label: 'Wallet: 0x4f...9a', type: 'crypto', color: '#f59e0b', icon: 'bitcoin', relation: 'funding' },
            { id: 'chimera_ops', label: 'Server: 192.168.X.X', type: 'server', color: '#8b5cf6', icon: 'server', relation: 'infrastructure' }
        ];
    }
    // Level 2: Expand "The Architect"
    else if (parentNode.id === 'chimera_boss') {
        newNodes = [
            { id: 'handler_1', label: 'Handler "Viper"', type: 'person', color: '#ef4444', relation: 'subordinate' },
            { id: 'handler_2', label: 'Handler "Ghost"', type: 'person', color: '#ef4444', relation: 'subordinate' },
            { id: 'loc_safehouse', label: 'Safehouse: Kiev', type: 'location', color: '#10b981', relation: 'last_seen' }
        ];
    }
    // Level 3: Expand "Finance"
    else if (parentNode.id === 'chimera_finance') {
        newNodes = [
            { id: 'bank_offshore', label: 'Acct: Cayman Isl.', type: 'corporate', color: '#3b82f6', relation: 'laundering' },
            { id: 'mixer_service', label: 'Tornado Cash', type: 'crypto', color: '#f59e0b', relation: 'mixing' }
        ];
    }

    // Add Scenario Nodes
    newNodes.forEach(n => {
        if (!appState.nodes.get(n.id)) { // Prevent duplicates
            appState.nodes.add({
                id: n.id,
                label: n.label,
                group: 'chimera', // Marker for scenario logic
                shape: 'dot',
                color: { background: n.color, border: '#fff' },
                size: n.id === 'chimera_boss' ? 40 : 25,
                data: { type: n.type, value: n.label, risk: 'CRITICAL' }
            });
            appState.edges.add({ from: parentId, to: n.id, label: n.relation });
        }
    });

    if (newNodes.length === 0) {
        alert(">> END OF INTELLIGENCE TRAIL. TARGET SECURED.");
    }
}

function generateMockEntity(parentType) {
    // Simple logic to generate relevant mock connections
    const types = [
        { type: 'social', label: 'Twitter Account', icon: 'twitter', color: '#1d9bf0', relation: 'registered_on' },
        { type: 'social', label: 'LinkedIn Profile', icon: 'linkedin', color: '#0a66c2', relation: 'career' },
        { type: 'email', label: 'proto***@gmail.com', icon: 'at', color: '#ea4335', relation: 'recovery_email' },
        { type: 'phone', label: '+1-202-555-01**', icon: 'phone', color: '#10b981', relation: '2fa_linked' },
        { type: 'breach', label: 'Database Breach', icon: 'triangle-exclamation', color: '#f59e0b', relation: 'leaked_in' },
        { type: 'location', label: 'San Francisco, CA', icon: 'location-dot', color: '#8b5cf6', relation: 'last_login' }
    ];

    const random = types[Math.floor(Math.random() * types.length)];

    // Generate random username/handle
    const suffix = Math.floor(Math.random() * 9999);

    return {
        label: random.label === 'Twitter Account' ? `@user_${suffix}` : random.label,
        shape: 'dot',
        color: { background: random.color, border: '#ffffff' },
        relation: random.relation,
        data: {
            type: random.type,
            value: random.label === 'Twitter Account' ? `@user_${suffix}` : random.label,
            risk: Math.floor(Math.random() * 100) + '%'
        }
    };
}

// --- UI Interaction ---
function showLoader(show) {
    const loader = document.querySelector('.graph-loader');
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}

function showEntityDetails(node) {
    const panel = document.getElementById('properties-panel');
    const details = document.getElementById('entity-details');
    const transforms = document.getElementById('transform-list');

    // Panel Content
    let html = `
        <div class="prop-row">
            <div class="prop-label">Entity Type</div>
            <div class="prop-value"><span class="badge">${node.data.type || 'Unknown'}</span></div>
        </div>
        <div class="prop-row">
            <div class="prop-label">Value</div>
            <div class="prop-value">${node.data.value}</div>
        </div>
        <div class="prop-row">
            <div class="prop-label">System ID</div>
            <div class="prop-value">${node.id}</div>
        </div>
    `;

    if (node.data.risk) {
        html += `
        <div class="prop-row">
            <div class="prop-label">Risk Score</div>
            <div class="prop-value" style="color: #ef4444; font-weight: bold;">${node.data.risk}</div>
        </div>`;
    }

    details.innerHTML = html;

    // Dynamic Transforms based on type
    let actions = '';
    if (node.data.type === 'email') {
        actions += `<li class="transform-item" onclick="runTransform('${node.id}', 'breach')"><i class="fa-solid fa-user-secret"></i> Check Leaks</li>`;
        actions += `<li class="transform-item" onclick="runTransform('${node.id}', 'social')"><i class="fa-brands fa-google"></i> Find Social Accounts</li>`;
    } else if (node.data.type === 'phone') {
        actions += `<li class="transform-item" onclick="runTransform('${node.id}', 'whatsapp')"><i class="fa-brands fa-whatsapp"></i> Check WhatsApp</li>`;
        actions += `<li class="transform-item" onclick="runTransform('${node.id}', 'callapp')"><i class="fa-solid fa-address-book"></i> Validate Caller ID</li>`;
    } else if (node.data.type === 'person') {
        actions += `<li class="transform-item" onclick="window.specialOps.initiateFaceScan('${node.label}')"><i class="fa-solid fa-id-card"></i> Biometric Facial Scan</li>`;
        actions += `<li class="transform-item" onclick="runTransform('${node.id}', 'connections')"><i class="fa-solid fa-people-arrows"></i> Map Associates</li>`;
    } else if (node.data.type === 'server' || node.data.type === 'crypto') {
        actions += `<li class="transform-item" onclick="window.specialOps.initiateDecryption('${node.label}')"><i class="fa-solid fa-unlock-keyhole"></i> Decrypt Traffic</li>`;
    } else {
        actions += `<li class="transform-item" onclick="runTransform('${node.id}', 'general')"><i class="fa-solid fa-magnifying-glass-plus"></i> Deep Search</li>`;
    }

    transforms.innerHTML = actions;
    panel.classList.add('active'); // Slide in
}

function hideEntityDetails() {
    const panel = document.getElementById('properties-panel');
    panel.classList.remove('active');
}

function initPanelHandler() {
    document.querySelector('.close-panel').addEventListener('click', hideEntityDetails);
}

// --- 5. Breach Simulation ---
const breaches = [
    { name: 'LinkedIn 2012', data: 'Email, Password Hash', date: '2012-05' },
    { name: 'Adobe', data: 'Email, Hint, Password', date: '2013-10' },
    { name: 'Canva', data: 'Email, Name, City', date: '2019-05' },
    { name: 'Facebook', data: 'Phone, Name, Location', date: '2021-04' }
];

function checkBreaches(emailNodeId) {
    showLoader(true);
    setTimeout(() => {
        const numBreaches = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numBreaches; i++) {
            const breach = breaches[Math.floor(Math.random() * breaches.length)];
            const breachId = `breach_${Date.now()}_${i}`;

            // Add breach node
            appState.nodes.add({
                id: breachId,
                label: `[LEAK] ${breach.name}`,
                shape: 'box',
                color: { background: '#ef4444', border: '#fff' },
                font: { color: 'white' },
                data: {
                    type: 'breach_data',
                    value: breach.name,
                    details: `Data: ${breach.data}\nDate: ${breach.date}`
                }
            });

            appState.edges.add({ from: emailNodeId, to: breachId, label: 'exposed_in', color: { color: '#ef4444' } });
        }
        showLoader(false);
        alert(`⚠️ CRITICAL: ${numBreaches} Leaked Credentials Found.`);
        appState.network.fit();
    }, 1200);
}

// Global scope for onclick handlers
window.runTransform = function (nodeId, type) {
    if (type === 'breach') {
        checkBreaches(nodeId);
        return;
    }
    showLoader(true);
    // Simulate processing for others
    setTimeout(() => {
        simulateDiscovery(nodeId, type, 'extended');
        showLoader(false);
    }, 1000);
};
