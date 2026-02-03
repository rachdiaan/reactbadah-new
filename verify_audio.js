
// Script to check audio editions
async function checkAudio() {
    try {
        // Check the specific URL user gave (French?)
        console.log("Checking user provided URL...");
        const resUser = await fetch("https://api.alquran.cloud/v1/edition?format=audio&language=fr&type=versebyverse");
        const dataUser = await resUser.json();
        console.log("User URL count:", dataUser.data ? dataUser.data.length : 0);
        if (dataUser.data && dataUser.data.length > 0) {
            console.log("Sample FR Audio:", dataUser.data[0]);
        }

        // Check for standard Arabic (Mishary)
        console.log("\nChecking for Mishary (ar.alafasy)...");
        const resMishary = await fetch("https://api.alquran.cloud/v1/edition?format=audio&language=ar&type=versebyverse");
        const dataMishary = await resMishary.json();

        if (dataMishary.data) {
            const alafasy = dataMishary.data.find(e => e.identifier === 'ar.alafasy');
            if (alafasy) {
                console.log("Mishary found:", alafasy);
            } else {
                console.log("Mishary not found in list. Available:", dataMishary.data.map(e => e.identifier).slice(0, 5));
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

checkAudio();
