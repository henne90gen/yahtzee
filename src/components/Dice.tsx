import { Die } from "../logic/models";
import { ReactElement } from "react";
import { onDieLockChange } from "../store/game";
import { useAppDispatch } from "../store/store";

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

export function Dice(props: { dice: Die[]; disabled: boolean }) {
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
