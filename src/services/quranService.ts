
export interface SurahMeta {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export interface Ayah {
    number: number;
    text: string;
    translation: string;
    audio: string;
    numberInSurah: number;
    juz: number;
}

export interface SurahFull extends SurahMeta {
    ayahs: Ayah[];
}

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: controller.signal });
        return res;
    } finally {
        clearTimeout(id);
    }
}

export const quranService = {
    getAllSurahs: async (): Promise<SurahMeta[]> => {
        try {
            const response = await fetchWithTimeout('https://api.alquran.cloud/v1/meta');
            const data = await response.json();
            if (data.code === 200 && data.data?.surahs?.references) {
                return data.data.surahs.references;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch surah list:', error);
            return [];
        }
    },

    getSurah: async (number: number): Promise<SurahFull | null> => {
        try {
            const response = await fetchWithTimeout(
                `https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,id.indonesian,ar.alafasy`,
                12000
            );
            const data = await response.json();

            if (data.code === 200 && data.data && data.data.length >= 3) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const arabic = data.data.find((e: any) => e.edition?.identifier === 'quran-uthmani');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const translation = data.data.find((e: any) => e.edition?.language === 'id' || e.edition?.identifier === 'id.indonesian');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const audio = data.data.find((e: any) => e.edition?.format === 'audio');

                if (!arabic) return null;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mergedAyahs: Ayah[] = arabic.ayahs.map((ayah: any, index: number) => ({
                    number: ayah.number,
                    text: ayah.text,
                    translation: (translation?.ayahs?.[index]?.text) ?? '',
                    audio: (audio?.ayahs?.[index]?.audio) ?? '',
                    numberInSurah: ayah.numberInSurah,
                    juz: ayah.juz,
                }));

                return {
                    number: arabic.number,
                    name: arabic.name,
                    englishName: arabic.englishName,
                    englishNameTranslation: arabic.englishNameTranslation,
                    numberOfAyahs: arabic.numberOfAyahs,
                    revelationType: arabic.revelationType,
                    ayahs: mergedAyahs,
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch surah details:', error);
            return null;
        }
    },
};
