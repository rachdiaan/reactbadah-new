
// Script to check if we can use SDK or need raw fetch for Quran
// and to verify the data structure of /v1/meta

import { AlAdhanClient } from "@islamicnetwork/sdk";

// It seems SDK might only cover AlAdhan and Sermons?
// Let's check if we can simply use fetch for alquran.cloud as requested.
// The user explicitly linked https://api.alquran.cloud/v1/meta

async function checkQuranMeta() {
    try {
        console.log("Fetching Quran Meta...");
        const response = await fetch("https://api.alquran.cloud/v1/meta");
        const data = await response.json();

        if (data.code === 200 && data.data && data.data.surahs) {
            console.log("Surahs found:", data.data.surahs.count);
            console.log("First Surah:", data.data.surahs.references[0]);
            console.log("Last Surah:", data.data.surahs.references[113]);
        } else {
            console.log("Unexpected response format:", data);
        }

    } catch (error) {
        console.error("Error fetching Quran Meta:", error);
    }
}

checkQuranMeta();
