import { Die } from "../models";
import React, { ReactElement } from "react";
import ScoreBoard from "../ScoreBoard";
import { doDiceRoll, endGame, onDieLockChange } from "../store/game";
import { useAppDispatch, useAppSelector } from "../store/store";
import t from "../translations";
import { selectCurrentPlayer } from "../store/selectors";

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

function DieSvg(props: {
    die: Die;
    disabled: boolean;
    onDieLockChange: () => void;
}) {
    const { die, disabled, onDieLockChange } = props;
    const { value, locked } = die;
    const dots: ReactElement[] = [];

    let color = "black";
    if (disabled || locked === "permanently-locked") {
        color = "gray";
    } else if (locked === "locked") {
        // TODO use a more beautiful shade of blue
        color = "blue";
    }

    if (topLeft(value)) {
        dots.push(<circle key={1} cx={25} cy={25} r={10} fill={color} />);
    }
    if (topRight(value)) {
        dots.push(<circle key={2} cx={75} cy={25} r={10} fill={color} />);
    }
    if (middleLeft(value)) {
        dots.push(<circle key={3} cx={25} cy={50} r={10} fill={color} />);
    }
    if (middle(value)) {
        dots.push(<circle key={4} cx={50} cy={50} r={10} fill={color} />);
    }
    if (middleRight(value)) {
        dots.push(<circle key={5} cx={75} cy={50} r={10} fill={color} />);
    }
    if (bottomLeft(value)) {
        dots.push(<circle key={6} cx={25} cy={75} r={10} fill={color} />);
    }
    if (bottomRight(value)) {
        dots.push(<circle key={7} cx={75} cy={75} r={10} fill={color} />);
    }

    return (
        <svg
            viewBox="0 0 100 100"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24"
            onClick={(event) => {
                event.preventDefault();
                onDieLockChange();
            }}
        >
            <path
                d="M 10 5 H 90 A 5 5 0 0 1 95 10 V 90 A 5 5 0 0 1 90 95 H 10 A 5 5 0 0 1 5 90 V 10 A 5 5 0 0 1 10 5"
                fill="white"
                stroke={color}
            />
            {dots}
        </svg>
    );
}

function Dice(props: { dice: Die[]; disabled: boolean }) {
    const { dice, disabled } = props;
    const dispatch = useAppDispatch();
    if (dice === null) {
        return null;
    }

    return (
        <div className="grid grid-cols-5">
            {dice.map((d, i) => (
                <div key={i} className="px-2">
                    {d.value === 0 ? (
                        "?"
                    ) : (
                        <DieSvg
                            die={d}
                            disabled={disabled}
                            onDieLockChange={() => dispatch(onDieLockChange(i))}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function PlayArea() {
    const dispatch = useAppDispatch();
    const dice = useAppSelector((state) => state.game.dice);
    const rollCount = useAppSelector((state) => state.game.rollCount);
    const currentPlayer = useAppSelector(selectCurrentPlayer);

    const onRollDiceClick = (event: React.MouseEvent) => {
        event.preventDefault();
        dispatch(doDiceRoll());
    };

    const disabled = rollCount === 0;
    const rollResults = (
        <>
            <div className="text-center">
                {t("playing_RollCount")} {rollCount}/3
            </div>
            <Dice dice={dice} disabled={disabled} />
        </>
    );

    const rollButtonDisabled = rollCount === 3;
    let rollButtonColor = "bg-green-500";
    if (rollButtonDisabled) {
        rollButtonColor = "bg-green-300";
    }
    return (
        <div className="grid gap-2 justify-items-center justify-center bg-white w-full sm:w-7/8 sm:w-3/4 mb-3 py-4 px-3 rounded md:rounded-lg shadow-lg">
            <div className="text-center text-2xl">{currentPlayer.name}</div>
            <button
                className={rollButtonColor + " w-48 py-2 rounded-xl text-white"}
                disabled={rollButtonDisabled}
                onClick={onRollDiceClick}
            >
                {t("playing_RollDice")}
            </button>
            {rollResults}
        </div>
    );
}

function EndGameCard() {
    const dispatch = useAppDispatch();
    return (
        <div className="grid justify-items-center justify-center bg-white w-full sm:w-3/4 mt-3 p-1 sm:p-2 md:p-4 rounded md:rounded-lg shadow-lg">
            <button
                className="bg-red-300 rounded text-gray-700 px-3 py-2 my-3"
                onClick={() => dispatch(endGame())}
            >
                {t("playing_EndGame")}
            </button>
        </div>
    );
}

export default function PlayingState() {
    const dispatch = useAppDispatch();
    return (
        <div className="flex flex-col items-center p-2 sm:p-0 sm:py-5 md:py-10">
            <PlayArea />
            <ScoreBoard />
            <EndGameCard />
        </div>
    );
}
