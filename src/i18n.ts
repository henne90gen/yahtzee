export const ALL_LANGUAGES = ['en', 'de'] as const;
type LanguageTuple = typeof ALL_LANGUAGES;
export type Language = LanguageTuple[number];

export type Translation<T extends string> = Record<Language, Record<T, string>>;

type TranslationKey =
    | 'ones'
    | 'twos'
    | 'threes'
    | 'fours'
    | 'fives'
    | 'sixes'
    | 'totalTop';

const TRANSLATIONS: Translation<TranslationKey> = {
    de: {
        ones: '',
        twos: '',
        threes: '',
        fours: '',
        fives: '',
        sixes: '',
        totalTop: '',
    },
    en: {
        ones: '',
        twos: '',
        threes: '',
        fours: '',
        fives: '',
        sixes: '',
        totalTop: '',
    },
};
let CURRENT_LANGUAGE: Language = 'de';

export default function t(key: TranslationKey): string {
    return TRANSLATIONS[CURRENT_LANGUAGE][key];
}
