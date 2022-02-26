import {EndTurnOption} from "./models";

export const ALL_LANGUAGES = ["en", "de"] as const;
type LanguageTuple = typeof ALL_LANGUAGES;
export type Language = LanguageTuple[number];

let CURRENT_LANGUAGE: Language = "de";

export type Translation<T extends string> = Record<Language, Record<T, string>>;

type ReadyTranslationKey =
    | "ready_StartGame"
    | "ready_InvalidNameMessage"
    | "ready_AddPlayerTooltip"
    | "ready_RemovePlayerTooltip";
type PlayingTranslationKey =
    | "playing_RollDice"
    | "playing_RollCount"
    | "playing_StrikeSomething"
    | "playing_EndGame";
type FinishedTranslationKey =
    | "finished_NewGame"
    | "finished_Wins"
    | "finished_Points";
type ScoreBoardTranslationKey =
    | EndTurnOption
    | "scoreBoard_UpperScore"
    | "scoreBoard_UpperBonus"
    | "scoreBoard_TotalUpperScore"
    | "scoreBoard_TotalLowerSection"
    | "scoreBoard_TotalUpperSection"
    | "scoreBoard_GrandTotal";
type SettingsTranslationKey =
    |"settings_Language";

export type TranslationKey =
    | ReadyTranslationKey
    | PlayingTranslationKey
    | FinishedTranslationKey
    | ScoreBoardTranslationKey
    | SettingsTranslationKey;

const TRANSLATIONS: Translation<TranslationKey> = {
    en: {
        "ready_StartGame": "Start Game",
        "ready_InvalidNameMessage": "Name cannot be empty",
        "ready_AddPlayerTooltip": "Add Player",
        "ready_RemovePlayerTooltip": "Remove Player",
        "playing_RollDice": "Roll Dice",
        "playing_RollCount": "",
        "playing_StrikeSomething": "",
        "playing_EndGame": "End Game",
        "finished_NewGame": "New Game",
        "finished_Wins": "wins",
        "finished_Points": "points",
        "ones": "Ones",
        "twos": "Twos",
        "threes": "Threes",
        "fours": "Fours",
        "fives": "Fives",
        "sixes": "Sixes",
        "scoreBoard_UpperScore": "Upper Score",
        "scoreBoard_UpperBonus": "Bonus",
        "scoreBoard_TotalUpperScore": "Total Upper Score",
        "threeOfAKind": "3 of a kind",
        "fourOfAKind": "4 of a kind",
        "fullHouse": "Full House",
        "smallStraight": "SM Straight",
        "largeStraight": "LG Straight",
        "chance": "Chance",
        "yahtzee": "Yahtzee",
        "scoreBoard_TotalLowerSection": "Total Lower Section",
        "scoreBoard_TotalUpperSection": "Total Upper Section",
        "scoreBoard_GrandTotal": "Grand Total",
        "settings_Language": "Language",
    },
    de: {
        "ready_StartGame": "Spiel starten",
        "ready_InvalidNameMessage": "Name darf nicht leer sein",
        "ready_AddPlayerTooltip": "Spieler hinzufügen",
        "ready_RemovePlayerTooltip": "Spieler entfernen",
        "playing_RollDice": "Würfeln",
        "playing_RollCount": "Wurf",
        "playing_StrikeSomething": "Streiche etwas",
        "playing_EndGame": "Spiel beenden",
        "finished_NewGame": "Neues Spiel",
        "finished_Wins": "gewinnt",
        "finished_Points": "Punkte",
        "ones": "Einsen",
        "twos": "Zweien",
        "threes": "Dreien",
        "fours": "Vieren",
        "fives": "Fünfen",
        "sixes": "Sechsen",
        "scoreBoard_UpperScore": "Zwischensumme Oben",
        "scoreBoard_UpperBonus": "Bonus",
        "scoreBoard_TotalUpperScore": "Summe Oben",
        "threeOfAKind": "Dreierpasch",
        "fourOfAKind": "Viererpasch",
        "fullHouse": "Full House",
        "smallStraight": "Kleine Straße",
        "largeStraight": "Große Straße",
        "chance": "Chance",
        "yahtzee": "Kniffel",
        "scoreBoard_TotalLowerSection": "Summe Oben",
        "scoreBoard_TotalUpperSection": "Summe Unten",
        "scoreBoard_GrandTotal": "Endsumme",
        "settings_Language": "Sprache",
    },
};

export default function t(key: TranslationKey): string {
    return TRANSLATIONS[CURRENT_LANGUAGE][key];
}

export function changeLanguage(newLanguage: Language) {
    CURRENT_LANGUAGE = newLanguage;
}
