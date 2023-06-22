export default function ({ label, isOn, onClick }: { label: string, isOn: boolean, onClick: () => void }) {
    return (
        <div className={`text-xs p-1 m-1 bg-gray-${isOn ? "300" : "200"} text-gray-500 dark:bg-gray-${isOn ? "600" : "700"} dark:text-gray-200 rounded-md`} onClick={onClick}>
            {label}
        </div>
    )
}