export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="bg-gray-300 dark:bg-gray-500 h-5">
            <div style={{ width: `${progress}%` }} className="bg-green-500 h-5"></div>
        </div>
    )
}