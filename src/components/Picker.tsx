export type PickerProps = {
    onChange: (value: string) => void;
    directoryOnly: boolean;
    value: string;
    label: string;
}

export default function Picker({ onChange, directoryOnly, value, label }: PickerProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Select {label}</h1>
        </div>
    );
}