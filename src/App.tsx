import ReadyState from "./game_states/ReadyState";
import PlayingState from "./game_states/PlayingState";
import FinishedState from "./game_states/FinishedState";
import { useAppSelector } from "./store/store";
import { SettingsButton, SettingsView } from "./SettingsView";

function App() {
    const state = useAppSelector(state => state.game.currentState);
    const isSettingsOpen = useAppSelector(
        (state) => state.settings.isSettingsOpen
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
