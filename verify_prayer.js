
import { AlAdhanClient, AlAdhanRequests } from "@islamicnetwork/sdk";

const client = AlAdhanClient.create();

async function checkPrayerTimes() {
    try {
        console.log("Fetching prayer times...");
        const request = new AlAdhanRequests.DailyPrayerTimesByCoordinatesRequest(
            "02-02-2026", // Using a fixed future date or current date
            -6.2088, // Jakarta
            106.8456,
            new AlAdhanRequests.PrayerTimesOptions()
        );

        const response = await client.prayerTimes().dailyByCoordinates(request);

        console.log("Fajr:", response.data.timings.Fajr);
        console.log("Maghrib:", response.data.timings.Maghrib);
        console.log("Date:", response.data.date.readable);

    } catch (error) {
        console.error("Error fetching prayer times:", error);
    }
}

checkPrayerTimes();
