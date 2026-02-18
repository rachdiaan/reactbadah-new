
import { SermonsClient, SermonsRequests, BoycottIsraeliClient, BoycottIsraeliRequests } from '@islamicnetwork/sdk';

async function verifySermons() {
    console.log("Checking Sermons API via SDK...");
    try {
        const client = SermonsClient.create({
            fetch: fetch
        });
        const response = await client.yearSermons(
            new SermonsRequests.YearSermonsRequest("uae-awqaf", new Date().getFullYear(), SermonsRequests.SermonType.Friday)
        );
        if (response && Array.isArray(response)) {
            console.log(`✅ Sermons API Reference Check: OK (Found data)`);
            return true;
        } else {
            console.log(`⚠️ Sermons API Reference Check: Empty or unexpected format`);
            return false;
        }
    } catch (error) {
        console.error("❌ Sermons API SDK Error:", error.message);
        return false;
    }
}

async function verifyBoycott() {
    console.log("Checking Boycott API via SDK...");
    try {
        const client = BoycottIsraeliClient.create({
            fetch: fetch
        });
        const response = await client.categories(
            new BoycottIsraeliRequests.CategoriesRequest()
        );
        if (response.data) {
            console.log(`✅ Boycott API Reference Check: OK (Found ${response.data.length} categories)`);
            return true;
        } else {
            console.log(`⚠️ Boycott API Reference Check: No data`);
            return false;
        }
    } catch (error) {
        console.error("❌ Boycott API SDK Error:", error.message);
        return false;
    }
}

async function run() {
    console.log("=== STARTING SDK VERIFICATION ===\n");
    await verifySermons();
    await verifyBoycott();
    console.log("\n=== VERIFICATION COMPLETE ===");
}

run();
