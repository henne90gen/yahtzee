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
    | "finished_NewGame"
    | "finished_Wins"
    | "finished_Points";
type ScoreBoardTranslationKey =
    | "scoreBoard_UpperSection"
    | "scoreBoard_Ones"
    | "scoreBoard_Twos"
    | "scoreBoard_Threes"
    | "scoreBoard_Fours"
    | "scoreBoard_Fives"
    | "scoreBoard_Sixes"
    | "scoreBoard_UpperScore"
    | "scoreBoard_UpperBonus"
    | "scoreBoard_TotalUpperScore"
    | "scoreBoard_LowerSection"
    | "scoreBoard_ThreeOfAKind"
    | "scoreBoard_FourOfAKind"
    | "scoreBoard_FullHouse"
    | "scoreBoard_SmallStraight"
    | "scoreBoard_LargeStraight"
    | "scoreBoard_Chance"
    | "scoreBoard_Yahtzee"
    | "scoreBoard_TotalLowerSection"
    | "scoreBoard_TotalUpperSection"
    | "scoreBoard_GrandTotal";

export type TranslationKey =
    | ReadyTranslationKey
    | PlayingTranslationKey
    | FinishedTranslationKey
    | ScoreBoardTranslationKey;

const TRANSLATIONS: Translation<TranslationKey> = {
    en: {
        "ready_StartGame": "Start Game",
        "ready_InvalidNameMessage": "Name cannot be empty",
        "ready_AddPlayerTooltip": "Add Player",
        "ready_RemovePlayerTooltip": "Remove Player",
        "playing_RollDice": "Roll Dice",
        "playing_EndGame": "End Game",
        "finished_NewGame": "New Game",
        "finished_Wins": "wins",
        "finished_Points": "points",
        "scoreBoard_UpperSection": "",
        "scoreBoard_Ones": "Ones",
        "scoreBoard_Twos": "Twos",
        "scoreBoard_Threes": "Threes",
        "scoreBoard_Fours": "Fours",
        "scoreBoard_Fives": "Fives",
        "scoreBoard_Sixes": "Sixes",
        "scoreBoard_UpperScore": "Upper Score",
        "scoreBoard_UpperBonus": "Bonus",
        "scoreBoard_TotalUpperScore": "Total Upper Score",
        "scoreBoard_LowerSection": "Lower Section",
        "scoreBoard_ThreeOfAKind": "3 of a kind",
        "scoreBoard_FourOfAKind": "4 of a kind",
        "scoreBoard_FullHouse": "Full House",
        "scoreBoard_SmallStraight": "SM Straight",
        "scoreBoard_LargeStraight": "LG Straight",
        "scoreBoard_Chance": "Chance",
        "scoreBoard_Yahtzee": "Yahtzee",
        "scoreBoard_TotalLowerSection": "Total Lower Section",
        "scoreBoard_TotalUpperSection": "Total Upper Section",
        "scoreBoard_GrandTotal": "Grand Total",
    },
    de: {
        "ready_StartGame": "Spiel starten",
        "ready_InvalidNameMessage": "Name darf nicht leer sein",
        "ready_AddPlayerTooltip": "Spieler hinzufügen",
        "ready_RemovePlayerTooltip": "Spieler entfernen",
        "playing_RollDice": "Würfeln",
        "playing_EndGame": "Spiel beenden",
        "finished_NewGame": "Neues Spiel",
        "finished_Wins": "gewinnt",
        "finished_Points": "Punkte",
        "scoreBoard_UpperSection": "",
        "scoreBoard_Ones": "Einsen",
        "scoreBoard_Twos": "Zweien",
        "scoreBoard_Threes": "Dreien",
        "scoreBoard_Fours": "Vieren",
        "scoreBoard_Fives": "Fünfen",
        "scoreBoard_Sixes": "Sechsen",
        "scoreBoard_UpperScore": "TODO", // TODO
        "scoreBoard_UpperBonus": "Bonus",
        "scoreBoard_TotalUpperScore": "TODO", // TODO
        "scoreBoard_LowerSection": "TODO", // TODO
        "scoreBoard_ThreeOfAKind": "Dreierpasch",
        "scoreBoard_FourOfAKind": "Viererpasch",
        "scoreBoard_FullHouse": "Full House",
        "scoreBoard_SmallStraight": "Kleine Straße",
        "scoreBoard_LargeStraight": "Große Straße",
        "scoreBoard_Chance": "Chance",
        "scoreBoard_Yahtzee": "Kniffel",
        "scoreBoard_TotalLowerSection": "TODO", // TODO
        "scoreBoard_TotalUpperSection": "TODO", // TODO
        "scoreBoard_GrandTotal": "TODO", // TODO
    },
};

export default function t(key: TranslationKey): string {
    return TRANSLATIONS[CURRENT_LANGUAGE][key];
}

export function changeLanguage(newLanguage: Language) {
    CURRENT_LANGUAGE = newLanguage;
}
