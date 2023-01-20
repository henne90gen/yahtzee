import ReadyState from "./game_states/ReadyState";
import PlayingState from "./game_states/PlayingState";
import FinishedState from "./game_states/FinishedState";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { SettingsButton, SettingsView } from "./SettingsView";

function App() {
    const state = useSelector((state: RootState) => state.game.currentState);
    const isSettingsOpen = useSelector(
        (state: RootState) => state.settings.isSettingsOpen
    );

    let view = null;
    switch (state) {
        case "ready":
            view = <ReadyState />;
            break;
        case "playing":
            view = <PlayingState />;
            break;
        case "finished":
            view = <FinishedState />;
            break;
    }

    if (isSettingsOpen) {
        view = <SettingsView />;
    }

    return (
        <div>
            <SettingsButton isSettingsOpen={isSettingsOpen} />
            {view}
        </div>
    );
}

export default App;
