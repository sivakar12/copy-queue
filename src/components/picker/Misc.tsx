export function Title({ text }: { text: string }) {
    return (
        <h1 className="text-md font-medium ml-1">{text}</h1>
    )
}

export function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="text-lg font-bold p-1 bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-white rounded-md flex justify-center items-center" onClick={onClick}>
            &lt;
        </div>
    )
}

export function PathDisplay({ path }: { path: string }) {
    return (
        <div className="flex-grow bg-gray-200 text-gray-500 dark:bg-gray-600 bg-gray dark:text-white ml-1 text-lg font-bold flex items-center p-1 break-all">{path}</div>
    )
}

export function ToggleButton({ label, isOn, onClick }: { label: string, isOn: boolean, onClick: () => void }) {
    return (
        <div className={`text-xs p-1 m-1 bg-gray-${isOn ? "300" : "200"} text-gray-500 dark:bg-gray-${isOn ? "600" : "700"} dark:text-gray-200 rounded-md`} onClick={onClick}>
            {label}
        </div>
    )
}