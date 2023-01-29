export function CheckboxSlider(props: {
    checked: boolean;
    onChange: () => void;
    className: string;
}) {
    return (
        <label className={"switch " + props.className}>
            <input
                type="checkbox"
                checked={props.checked}
                onChange={props.onChange}
            />
            <span className="slider" />
        </label>
    );
}
