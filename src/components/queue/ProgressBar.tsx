export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="bg-gray-300 dark:bg-gray-500 h-1 m-1 p-1">
            <div style={{ width: `${progress}%` }} className="bg-green-500 h-1"></div>
        </div>
    )
}