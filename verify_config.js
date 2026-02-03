
import { AlAdhanClient, AlAdhanRequests } from "@islamicnetwork/sdk";

const client = AlAdhanClient.create({
    baseUrl: "https://api.aladhan.com/v1",
    defaultHeaders: { "X-App": "al-matsurat-app" },
    defaultQuery: { iso8601: true },
    timeoutMs: 10_000,
    userAgent: "al-matsurat-client",
    fetch: globalThis.fetch
});

async function checkConfiguration() {
    try {
        console.log("Testing custom client configuration...");
        const request = new AlAdhanRequests.DailyPrayerTimesByCoordinatesRequest(
            "02-02-2026",
            -6.2088, // Jakarta
            106.8456,
            new AlAdhanRequests.PrayerTimesOptions()
        );

        const response = await client.prayerTimes().dailyByCoordinates(request);

        console.log("Fajr Raw:", response.data.timings.Fajr);
        console.log("Maghrib Raw:", response.data.timings.Maghrib);
        console.log("Date:", response.data.date.readable);

        // Check if it looks like ISO or HH:mm
        if (response.data.timings.Fajr.includes("T")) {
            console.log("Format detected: ISO 8601");
        } else {
            console.log("Format detected: HH:mm (Standard)");
        }

    } catch (error) {
        console.error("Error fetching with config:", error);
    }
}

checkConfiguration();
