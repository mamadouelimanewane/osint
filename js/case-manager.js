/**
 * Gravity OSINT - Case Management System (CMS)
 * Handles Saving/Loading investigations to local JSON files via Python Backend.
 */

class CaseManager {
    constructor() {
        this.currentCase = null;
    }

    async saveCase() {
        const caseName = prompt("Enter Case Name:", this.currentCase || `Case_${new Date().toISOString().split('T')[0]}`);
        if (!caseName) return;

        showLoader(true);

        // Export Graph Data
        const data = {
            nodes: appState.nodes.get(),
            edges: appState.edges.get(),
            meta: {
                created: new Date().toISOString(),
                operator: 'ADMIN',
                notes: "Investigation in progress."
            }
        };

        try {
            const res = await fetch('/api/save_case', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: caseName, content: data })
            });

            if (res.ok) {
                alert(`CASE SAVED: ${caseName}.json`);
                this.currentCase = caseName;
            } else {
                alert("ERROR: Could not save case. Is server.py running?");
            }
        } catch (e) {
            console.error(e);
            alert("Connection Failed. Run START_SYSTEM.bat");
        }
        showLoader(false);
    }

    async loadCase(filename) {
        // Not fully implemented in UI yet, but backend supports it.
        alert("Load feature coming in v5.9");
    }
}

// Global Hook
window.caseManager = new CaseManager();
window.saveCurrentCase = () => window.caseManager.saveCase();
