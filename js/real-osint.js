/**
 * Gravity OSINT - Real Data Module
 * Connects to PUBLIC APIs to fetch real-world data.
 * NOTE: Does not require a backend, runs directly in browser.
 */

class RealOSINT {
    constructor() {
        this.proxy = 'https://corsproxy.io/?'; // Fallback for CORS issues
    }

    // --- 1. IP Geolocation (Real Data) ---
    async lookupIP(ip) {
        try {
            // ip-api.com is free for non-commercial use (up to 45 req/min)
            const response = await fetch(`http://ip-api.com/json/${ip}`);
            const data = await response.json();

            if (data.status === 'fail') return null;

            return {
                country: data.country,
                city: data.city,
                isp: data.isp,
                lat: data.lat,
                lon: data.lon,
                query: data.query
            };
        } catch (e) {
            console.error("Real OSINT Error: IP Lookup Failed", e);
            return null;
        }
    }

    // --- 2. Google Dork Generator (Real Search Ops) ---
    generateDorks(query) {
        const q = encodeURIComponent(query);
        return [
            { label: 'LinkedIn Profile', url: `https://www.google.com/search?q=site:linkedin.com+${q}`, icon: 'linkedin' },
            { label: 'Instagram', url: `https://www.google.com/search?q=site:instagram.com+${q}`, icon: 'instagram' },
            { label: 'Twitter/X', url: `https://www.google.com/search?q=site:twitter.com+${q}`, icon: 'twitter' },
            { label: 'Pastebin Leaks', url: `https://www.google.com/search?q=site:pastebin.com+${q}`, icon: 'file-code' },
            { label: 'Files (PDF/DOC)', url: `https://www.google.com/search?q=filetype:pdf+OR+filetype:docx+${q}`, icon: 'file' }
        ];
    }

    // --- 3. User Existence Check (GitHub Example) ---
    async checkVCS(username) {
        const results = [];
        try {
            // Check GitHub (Public API)
            const gh = await fetch(`https://api.github.com/users/${username}`);
            if (gh.status === 200) results.push({ site: 'GitHub', exists: true });
        } catch (e) { }

        return results;
    }
}

// Global Instance
window.realOSINT = new RealOSINT();
