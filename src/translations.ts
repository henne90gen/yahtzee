export const ALL_LANGUAGES = ["en", "de"] as const;
type LanguageTuple = typeof ALL_LANGUAGES;
export type Language = LanguageTuple[number];

let CURRENT_LANGUAGE: Language = "en";

export type Translation<T extends string> = Record<Language, Record<T, string>>;

type ReadyTranslationKey =
    | "ready_StartGame"
    | "ready_InvalidNameMessage"
    | "ready_AddPlayerTooltip"
    | "ready_RemovePlayerTooltip";
type PlayingTranslationKey =
    | "playing_RollDice"
    | "playing_EndGame";
type FinishedTranslationKey =
    | "finished_NewGame";

export type TranslationKey =
    | ReadyTranslationKey
    | PlayingTranslationKey
    | FinishedTranslationKey;

const TRANSLATIONS: Translation<TranslationKey> = {
    en: {
        "ready_StartGame": "Start Game",
        "ready_InvalidNameMessage": "Name cannot be empty",
        "ready_AddPlayerTooltip": "Add Player",
        "ready_RemovePlayerTooltip": "Remove Player",
        "playing_RollDice": "",
        "playing_EndGame": "",
        "finished_NewGame": "",
    },
    de: {
        "ready_StartGame": "",
        "ready_InvalidNameMessage": "Name darf nicht leer sein",
        "ready_AddPlayerTooltip": "",
        "ready_RemovePlayerTooltip": "",
        "playing_RollDice": "",
        "playing_EndGame": "",
        "finished_NewGame": "",
    },
};

export default function t(key: TranslationKey): string {
    return TRANSLATIONS[CURRENT_LANGUAGE][key];
}

export function changeLanguage(newLanguage: Language) {
    CURRENT_LANGUAGE = newLanguage;
}
