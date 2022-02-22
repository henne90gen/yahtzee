import {AllEndTurnOptions, Die, EndTurnOption, Player} from "../models";
import React, {ReactElement} from "react";
import {getAvailableOptions, playerCanStrike} from "../logic";
import ScoreBoard from "../ScoreBoard";
import {doDiceRoll, endGame, endTurn, onDieLockChange} from "../store/game";
import {RootState} from "../store/store";
import {useDispatch, useSelector} from "react-redux";
import t from "../translations";

function topLeft(value: number) {
    return value === 2 || value === 4 || value === 5 || value === 6;
}

function topRight(value: number) {
    return value === 3 || value === 4 || value === 5 || value === 6;
}

function middleLeft(value: number) {
    return value === 6;
}

function middle(value: number) {
    return value === 1 || value === 3 || value === 5;
}

function middleRight(value: number) {
    return value === 6;
}

function bottomLeft(value: number) {
    return value === 3 || value === 4 || value === 5 || value === 6;
}

function bottomRight(value: number) {
    return value === 2 || value === 4 || value === 5 || value === 6;
}

function DieSvg(props: { die: Die, onDieLockChange: () => void }) {
    const {die, onDieLockChange} = props;
    const {value, locked} = die;
    const dots: ReactElement[] = [];

    let color = "black";
    if (locked === "locked") {
        // TODO use a more beautiful shade of blue
        color = "blue";
    } else if (locked === "permanently-locked") {
        color = "gray";
    }

    if (topLeft(value)) {
        dots.push(<circle key={1} cx={25} cy={25} r={10} fill={color}/>)
    }
    if (topRight(value)) {
        dots.push(<circle key={2} cx={75} cy={25} r={10} fill={color}/>)
    }
    if (middleLeft(value)) {
        dots.push(<circle key={3} cx={25} cy={50} r={10} fill={color}/>)
    }
    if (middle(value)) {
        dots.push(<circle key={4} cx={50} cy={50} r={10} fill={color}/>)
    }
    if (middleRight(value)) {
        dots.push(<circle key={5} cx={75} cy={50} r={10} fill={color}/>)
    }
    if (bottomLeft(value)) {
        dots.push(<circle key={6} cx={25} cy={75} r={10} fill={color}/>)
    }
    if (bottomRight(value)) {
        dots.push(<circle key={7} cx={75} cy={75} r={10} fill={color}/>)
    }

    return <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24" onClick={(event => {
        event.preventDefault();
        onDieLockChange();
    })}>
        <path d="M 10 5 H 90 A 5 5 0 0 1 95 10 V 90 A 5 5 0 0 1 90 95 H 10 A 5 5 0 0 1 5 90 V 10 A 5 5 0 0 1 10 5"
              fill="white" stroke={color}/>
        {dots}
    </svg>;
}

function Dice(props: {
    dice: Die[];
}) {
    const {dice} = props;
    const dispatch = useDispatch();
    if (dice === null) {
        return null;
    }

    return (
        <div className="grid grid-cols-5">
            {dice.map((d, i) => (
                <div key={i} className="px-2">
                    {d.value === 0 ? '?' : <DieSvg die={d} onDieLockChange={() => dispatch(onDieLockChange(i))}/>}
                </div>
            ))}
        </div>
    );
}

function StrikeSelector(props: { currentPlayer: Player, rollCount: number, selectedOption: (option: EndTurnOption, strike: boolean) => void }) {
    const {currentPlayer, rollCount, selectedOption} = props;
    if (rollCount === 0) {
        return null;
    }

    return <select
        defaultValue=""
        onChange={(event) => {
            event.preventDefault();
            selectedOption(event.currentTarget.value as EndTurnOption, true);
        }}
        className="bg-red-300 rounded p-2 m-2"
    >
        <option value="" disabled>Strike something</option>
        {AllEndTurnOptions.filter(option => playerCanStrike(currentPlayer, option))
            .map((option, i) => {
                return <option key={i} value={option}>{option}</option>
            })
        }
    </select>;
}

function DiceOptions(props: { currentPlayer: Player, dice: Die[], selectedOption: (option: EndTurnOption, strike: boolean) => void }) {
    const {currentPlayer, dice, selectedOption} = props;
    const renderedOptions = getAvailableOptions(currentPlayer, dice)
        .map((option, i) => {
            return <button
                key={i}
                className="bg-green-400 rounded p-2 m-2"
                onClick={(event) => {
                    event.preventDefault();
                    selectedOption(option, false);
                }}
            >
                {option}
            </button>
        });

    return <div>
        {renderedOptions}
    </div>;
}

function PlayArea() {
    const dice = useSelector((state: RootState) => state.game.dice);
    const rollCount = useSelector((state: RootState) => state.game.rollCount);
    const players = useSelector((state: RootState) => state.game.players);
    const currentPlayerIndex = useSelector((state: RootState) => state.game.currentPlayerIndex);
    const currentPlayer = players[currentPlayerIndex];
    const dispatch = useDispatch();

    const onRollDiceClick = (event: React.MouseEvent) => {
        event.preventDefault();
        dispatch(doDiceRoll());
    };

    function selectedOption(option: EndTurnOption, strike: boolean) {
        dispatch(endTurn({option, strike}));
    }

    const rollResults = <>
        <div className="text-center">Roll {rollCount}</div>
        <Dice dice={dice}/>
        <DiceOptions
            currentPlayer={currentPlayer}
            dice={dice}
            selectedOption={selectedOption}
        />
        <StrikeSelector
            currentPlayer={currentPlayer}
            rollCount={rollCount}
            selectedOption={selectedOption}
        />
    </>

    const rollButtonDisabled = rollCount === 3;
    let rollButtonColor = "bg-green-500";
    if (rollButtonDisabled) {
        rollButtonColor = "bg-green-300";
    }
    return (
        <div
            className="grid gap-2 justify-items-center justify-center bg-white w-full sm:w-7/8 sm:w-3/4 mb-3 py-4 px-3 rounded md:rounded-lg shadow-lg">
            <div className="text-center text-2xl">{currentPlayer.name}</div>
            <button
                className={rollButtonColor + " w-48 py-2 rounded-xl text-white"}
                disabled={rollButtonDisabled}
                onClick={onRollDiceClick}
            >
                {t("playing_RollDice")}
            </button>
            {rollCount === 0 ? null : rollResults}
        </div>
    );
}

export default function PlayingState() {
    const dispatch = useDispatch();
    const players = useSelector((state: RootState) => state.game.players);
    return (
        <div className="flex flex-col items-center p-2 sm:p-0 sm:py-5 md:py-10">
            <PlayArea/>
            <ScoreBoard players={players}/>
            <div
                className="grid gap-2 justify-items-center justify-center bg-white w-full sm:w-7/8 sm:w-3/4 mt-3 py-4 px-3 rounded md:rounded-lg shadow-lg">
                <button
                    className="bg-red-300 px-3 py-2 rounded text-gray-700"
                    onClick={() => dispatch(endGame())}
                >
                    {t("playing_EndGame")}
                </button>
            </div>
        </div>
    );
}
