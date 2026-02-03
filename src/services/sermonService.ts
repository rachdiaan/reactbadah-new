
import { SermonsClient, SermonsRequests } from "@islamicnetwork/sdk";


const client = SermonsClient.create({
    defaultHeaders: { "X-App": "al-matsurat-app" },
    timeoutMs: 10_000,
    userAgent: "al-matsurat-client",
    fetch: globalThis.fetch
});

export interface Sermon {
    id: string;
    title: string;
    date: string;
    type: string;
    source: string;
    editions?: {
        language: string;
        content: string;
    }[];
}

export const sermonService = {
    getLatestSermons: async (year: number = new Date().getFullYear()): Promise<Sermon[]> => {
        try {
            // Fetch for UAE Awqaf as default source for now
            // type 1 = Friday Sermon
            const response = await client.yearSermons(
                new SermonsRequests.YearSermonsRequest("uae-awqaf", year, SermonsRequests.SermonType.Friday)
            );

            // Flatten the response structure if needed or return relevant sermon list
            // Response is usually array of MonthSermons
            // Flatten and map to Sermon interface
            const allSermons: Sermon[] = [];
            if (response && Array.isArray(response)) {
                response.forEach(month => {
                    if (month.sermons) {
                        // Map SDK sermon to our interface, generating an ID if missing
                        const mappedSermons = month.sermons.map((s: any) => ({
                            id: s.id || `${s.source}-${s.date}-${s.type}`,
                            title: s.title,
                            date: s.date,
                            type: s.type,
                            source: s.source,
                            editions: s.editions
                        }));
                        allSermons.push(...mappedSermons);
                    }
                });
            }

            // Sort by date descending
            return allSermons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (error) {
            console.error("Failed to fetch sermons:", error);
            return [];
        }
    },

    getSermonLanguage: async () => {
        // Future implementation for language filtering
    }
};
