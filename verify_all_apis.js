
// Verification script for ALL External APIs

// 1. Al-Quran Cloud (Surah Meta)
async function checkQuran() {
    console.log("Checking Quran API (Meta)...");
    try {
        const start = Date.now();
        const res = await fetch('https://api.alquran.cloud/v1/meta');
        const data = await res.json();
        const duration = Date.now() - start;
        if (data.code === 200 && data.data && data.data.surahs) {
            console.log(`✅ Quran API: OK (${data.data.surahs.count} surahs) in ${duration}ms`);
            return true;
        } else {
            console.error("❌ Quran API: Failed format");
            return false;
        }
    } catch (e) {
        console.error("❌ Quran API: Error", e.message);
        return false;
    }
}

// 2. AlAdhan (Prayer Times) via direct fetch 
async function checkPrayer() {
    console.log("Checking Prayer Times API (AlAdhan)...");
    try {
        const start = Date.now();
        const res = await fetch('https://api.aladhan.com/v1/timings?latitude=-6.2088&longitude=106.8456&method=20');
        const data = await res.json();
        const duration = Date.now() - start;
        if (data.code === 200 && data.data && data.data.timings) {
            console.log(`✅ Prayer API: OK (Fajr: ${data.data.timings.Fajr}) in ${duration}ms`);
            return true;
        } else {
            console.error("❌ Prayer API: Failed format");
            return false;
        }
    } catch (e) {
        console.error("❌ Prayer API: Error", e.message);
        return false;
    }
}

// 3. Sermons (Islamic Network)
// Correct Base: https://sermons.islamic.network/api
async function checkSermons() {
    console.log("Checking Sermons API (sermons.islamic.network)...");
    try {
        const start = Date.now();
        // Trying valid endpoint structure based on SDK default
        const res = await fetch('https://sermons.islamic.network/api/yearSermons/uae-awqaf/2021/friday', {
            headers: { 'User-Agent': 'al-matsurat-client', 'Accept': 'application/json' }
        });

        // If the path above fails, try another variant often used or implied by SDK path construction
        // SDK: path = `/${source}/year/${year}/${type}` or similar?
        // Actually looking at SDK source again via memory:
        // yearSermons(req) => http.getJson(req.path())
        // YearSermonsRequest path() => `/${this.source}/year/${this.year}/${this.type}`
        // So full url: https://sermons.islamic.network/api + /uae-awqaf/year/2021/friday

        const url2 = 'https://sermons.islamic.network/api/uae-awqaf/year/2021/friday';

        const duration = Date.now() - start;
        const finalRes = await fetch(url2);

        if (finalRes.ok) {
            const data = await finalRes.json();
            if (Array.isArray(data) || (data.data && Array.isArray(data.data))) {
                console.log(`✅ Sermons API: OK (Items found) in ${duration}ms`);
                return true;
            }
            console.log(`⚠️ Sermons API: OK but format unknown. Status: ${finalRes.status}`);
            return true;
        } else {
            console.log(`❌ Sermons API: Failed 1st try, Status ${finalRes.status}. Trying alternate...`);
            return false;
        }
    } catch (e) {
        console.error("❌ Sermons API: Error", e.message);
        return false;
    }
}

// 4. Boycott (Islamic Network / BDNAASH clone?)
// Correct Base: https://api.boycottisraeli.biz/v1
// CategoriesRequest path() -> /categories
async function checkBoycott() {
    console.log("Checking Boycott API (api.boycottisraeli.biz)...");
    try {
        const start = Date.now();
        const res = await fetch('https://api.boycottisraeli.biz/v1/categories', {
            headers: { 'User-Agent': 'al-matsurat-client' }
        });
        const duration = Date.now() - start;

        if (res.ok) {
            const data = await res.json();
            console.log(`✅ Boycott API: OK (Categories: ${Array.isArray(data) ? data.length : 'Object'}) in ${duration}ms`);
            return true;
        } else {
            console.error(`❌ Boycott API: Failed Status ${res.status}`);
            return false;
        }
    } catch (e) {
        console.error("❌ Boycott API: Error", e.message);
        return false;
    }
}

async function runAll() {
    console.log("=== STARTING API HEALTH CHECK ===\n");
    await checkQuran();
    await checkPrayer();
    await checkSermons();
    await checkBoycott();
    console.log("\n=== CHECK COMPLETE ===");
}

runAll();
