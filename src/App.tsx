import ReadyState from "./game_states/ReadyState";
import PlayingState from "./game_states/PlayingState";
import FinishedState from "./game_states/FinishedState";
import { useAppSelector } from "./store/store";
import { SettingsButton, SettingsView } from "./components/SettingsView";

function App() {
    const state = useAppSelector((state) => state.game.currentState);
    const isSettingsOpen = useAppSelector(
        (state) => state.settings.isSettingsOpen
    );

    // NOTE: referencing the language here, so that the whole App re-renders, when the language changes
    useAppSelector((state) => state.settings.language);

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
        <div className="grid grid-cols-1 gap-5 justify-center w-full sm:w-5/6 md:w-3/4 xl:w-[60rem] p-2 sm:p-0 sm:py-5 md:py-10">
            <SettingsButton isSettingsOpen={isSettingsOpen} />
            {view}
        </div>
    );
}

export default App;
