export type PickerProps = {
    onChange: (value: string) => void;
    directoryOnly: boolean;
    value: string;
    label: string;
}

export default function Picker({ onChange, directoryOnly, value, label }: PickerProps) {
    return (
        <div>
            <h1>Picker</h1>
            <h2>Select {label}</h2>
        </div>
    );
}