import React from 'react';
import ReadyState from "./game_states/ReadyState";
import PlayingState from "./game_states/PlayingState";
import FinishedState from "./game_states/FinishedState";
import {useSelector} from "react-redux";
import {RootState} from "./store";

function App() {
    const state = useSelector((state: RootState) => state);
    switch (state.game.currentState) {
        case 'ready':
            return <ReadyState/>;
        case 'playing':
            return <PlayingState/>;
        case 'finished':
            return <FinishedState/>;
    }
    return null;
}

export default App;
