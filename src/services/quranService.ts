
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

export const quranService = {
    // Get list of all Surahs (Metadata)
    getAllSurahs: async (): Promise<SurahMeta[]> => {
        try {
            const response = await fetch('https://api.alquran.cloud/v1/meta');
            const data = await response.json();
            if (data.code === 200 && data.data && data.data.surahs) {
                return data.data.surahs.references;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch surah list:', error);
            return [];
        }
    },

    // Get specific Surah with Text, Translation, and Audio
    getSurah: async (number: number): Promise<SurahFull | null> => {
        try {
            // Fetch 3 editions: Uthmani Text, Indonesian Translation, Alafasy Audio
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,id.indonesian,ar.alafasy`);
            const data = await response.json();

            if (data.code === 200 && data.data && data.data.length >= 3) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const arabic = data.data.find((e: any) => e.edition?.identifier === 'quran-uthmani');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const translation = data.data.find((e: any) => e.edition?.language === 'id' || e.edition?.identifier === 'id.indonesian');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const audio = data.data.find((e: any) => e.edition?.format === 'audio');

                if (!arabic) return null;

                // Merge into single Ayah objects
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mergedAyahs: Ayah[] = arabic.ayahs.map((ayah: any, index: number) => ({
                    number: ayah.number,
                    text: ayah.text,
                    translation: translation ? translation.ayahs[index].text : '',
                    audio: audio ? audio.ayahs[index].audio : '',
                    numberInSurah: ayah.numberInSurah,
                    juz: ayah.juz
                }));

                return {
                    number: arabic.number,
                    name: arabic.name,
                    englishName: arabic.englishName,
                    englishNameTranslation: arabic.englishNameTranslation,
                    numberOfAyahs: arabic.numberOfAyahs,
                    revelationType: arabic.revelationType,
                    ayahs: mergedAyahs
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch surah details:', error);
            return null;
        }
    }
};
