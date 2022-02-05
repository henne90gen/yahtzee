import React from 'react';
import ReadyState from "./ReadyState";
import PlayingState from "./PlayingState";
import FinishedState from "./FinishedState";
import {useSelector} from "react-redux";
import {RootState} from "./store";

function App() {
    const gameState = useSelector((state: RootState) => state.game.currentState);

    switch (gameState) {
        case 'ready':
            return <ReadyState/>;
        case 'playing':
            return <PlayingState/>;
        case 'finished':
            return <FinishedState/>;
    }
}

export default App;
