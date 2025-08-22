export default function ({ label, isOn, onClick }: { label: string, isOn: boolean, onClick: () => void }) {
    return (
        <div className={`text-xs px-3 py-1 m-1 bg-gray-${isOn ? "300" : "200"} hover:bg-gray-${isOn ? "400" : "300"} text-gray-500 dark:bg-gray-${isOn ? "600" : "700"} dark:hover:bg-gray-${isOn ? "500" : "600"} dark:text-gray-200 rounded-3xl cursor-pointer transition-colors`} onClick={onClick}>
            {label}
        </div>
    )
}