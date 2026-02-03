
import { SermonsClient, SermonsRequests } from "@islamicnetwork/sdk";

const client = SermonsClient.create();

async function checkSermons() {
    try {
        console.log("Fetching year sermons...");
        const months = await client.yearSermons(
            new SermonsRequests.YearSermonsRequest("uae-awqaf", 2023, SermonsRequests.SermonType.Friday)
        );

        if (months.length > 0 && months[0].sermons.length > 0) {
            console.log("First Sermon Title:", months[0].sermons[0].title);
            // Try to fetch detail to see language/content
            const sermonId = months[0].sermons[0].id; // Assuming ID structure or just inspect the object
            console.log("Sermon Object Keys:", Object.keys(months[0].sermons[0]));
        } else {
            console.log("No sermons found for 2023. Designating fallback.");
        }

    } catch (error) {
        console.error("Error fetching sermons:", error);
    }
}

checkSermons();
