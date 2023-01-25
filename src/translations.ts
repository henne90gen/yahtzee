import { ScoreKey } from "./logic/models";

export const ALL_LANGUAGES = ["en", "de"] as const;
type LanguageTuple = typeof ALL_LANGUAGES;
export type Language = LanguageTuple[number];

let CURRENT_LANGUAGE: Language = "de";

export type Translation<T extends string> = Record<Language, Record<T, string>>;

type ReadyTranslationKey =
    | "ready_StartGame"
    | "ready_InvalidNameMessage"
    | "ready_AI"
    | "ready_AddPlayerTooltip"
    | "ready_RemovePlayerTooltip"
    | "ready_NotEnoughPlayers";
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
    | ScoreKey
    | "scoreBoard_UpperScore"
    | "scoreBoard_UpperBonus"
    | "scoreBoard_TotalUpperScore"
    | "scoreBoard_TotalLowerSection"
    | "scoreBoard_TotalUpperSection"
    | "scoreBoard_GrandTotal"
    | "scoreBoard_Enter"
    | "scoreBoard_Strike";
type SettingsTranslationKey =
    | "settings_Language"
    | "settings_statistics_GamesCompleted"
    | "settings_statistics_TotalScores"
    | "settings_statistics_FilledCount"
    | "settings_statistics_NotFilledCount"
    | "settings_statistics_StrikesCount"
    | "settings_statistics_TotalScore"
    | "settings_statistics_AverageScore";

export type TranslationKey =
    | ReadyTranslationKey
    | PlayingTranslationKey
    | FinishedTranslationKey
    | ScoreBoardTranslationKey
    | SettingsTranslationKey;

const TRANSLATIONS: Translation<TranslationKey> = {
    en: {
        ready_StartGame: "Start Game",
        ready_InvalidNameMessage: "Name cannot be empty",
        ready_AI: "AI",
        ready_AddPlayerTooltip: "Add Player",
        ready_RemovePlayerTooltip: "Remove Player",
        ready_NotEnoughPlayers: "Not Enough Players",
        playing_RollDice: "Roll Dice",
        playing_RollCount: "",
        playing_StrikeSomething: "",
        playing_EndGame: "End Game",
        finished_NewGame: "New Game",
        finished_Wins: "wins",
        finished_Points: "points",
        ones: "Ones",
        twos: "Twos",
        threes: "Threes",
        fours: "Fours",
        fives: "Fives",
        sixes: "Sixes",
        scoreBoard_UpperScore: "Upper Score",
        scoreBoard_UpperBonus: "Bonus",
        scoreBoard_TotalUpperScore: "Total Upper Score",
        threeOfAKind: "3 of a kind",
        fourOfAKind: "4 of a kind",
        fullHouse: "Full House",
        smallStraight: "Small Straight",
        largeStraight: "Large Straight",
        chance: "Chance",
        yahtzee: "Yahtzee",
        scoreBoard_TotalLowerSection: "Total Lower Section",
        scoreBoard_TotalUpperSection: "Total Upper Section",
        scoreBoard_GrandTotal: "Grand Total",
        settings_Language: "Language",
        settings_statistics_GamesCompleted: "Games Completed",
        settings_statistics_TotalScores: "Total Scores",
        settings_statistics_FilledCount: "Filled",
        settings_statistics_NotFilledCount: "Not Filled",
        settings_statistics_StrikesCount: "Strikes",
        settings_statistics_TotalScore: "Total Score",
        settings_statistics_AverageScore: "Average Score",
        scoreBoard_Enter: "Enter",
        scoreBoard_Strike: "Strike",
    },
    de: {
        ready_StartGame: "Spiel starten",
        ready_InvalidNameMessage: "Name darf nicht leer sein",
        ready_AI: "KI",
        ready_AddPlayerTooltip: "Spieler hinzufügen",
        ready_RemovePlayerTooltip: "Spieler entfernen",
        ready_NotEnoughPlayers: "Nicht genügend Spieler",
        playing_RollDice: "Würfeln",
        playing_RollCount: "Wurf",
        playing_StrikeSomething: "Streiche etwas",
        playing_EndGame: "Spiel beenden",
        finished_NewGame: "Neues Spiel",
        finished_Wins: "gewinnt",
        finished_Points: "Punkte",
        ones: "Einsen",
        twos: "Zweien",
        threes: "Dreien",
        fours: "Vieren",
        fives: "Fünfen",
        sixes: "Sechsen",
        scoreBoard_UpperScore: "Zwischensumme Oben",
        scoreBoard_UpperBonus: "Bonus",
        scoreBoard_TotalUpperScore: "Summe Oben",
        threeOfAKind: "Dreierpasch",
        fourOfAKind: "Viererpasch",
        fullHouse: "Full House",
        smallStraight: "Kleine Straße",
        largeStraight: "Große Straße",
        chance: "Chance",
        yahtzee: "Kniffel",
        scoreBoard_TotalLowerSection: "Summe Oben",
        scoreBoard_TotalUpperSection: "Summe Unten",
        scoreBoard_GrandTotal: "Endsumme",
        settings_Language: "Sprache",
        settings_statistics_GamesCompleted: "Abgeschlossene Spiele",
        settings_statistics_TotalScores: "Gesamtpunktzahl",
        settings_statistics_FilledCount: "Ausgefüllt",
        settings_statistics_NotFilledCount: "Nicht Ausgefüllt",
        settings_statistics_StrikesCount: "Gestrichen",
        settings_statistics_TotalScore: "Gesamtpunktzahl",
        settings_statistics_AverageScore: "Durchschnittspunktzahl",
        scoreBoard_Enter: "Eintragen",
        scoreBoard_Strike: "Streichen",
    },
};

export default function t(key: TranslationKey): string {
    return TRANSLATIONS[CURRENT_LANGUAGE][key];
}

export function changeLanguage(newLanguage: Language) {
    CURRENT_LANGUAGE = newLanguage;
}
