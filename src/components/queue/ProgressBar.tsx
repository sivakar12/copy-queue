export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <div style={{ width: '100%'}} className="bg-gray-300 dark:bg-gray-500 h-1 m-1 rounded-3xl">
            <div style={{ width: `${progress}%` }} className="bg-green-500 h-1 rounded-3xl"></div>
        </div>
    )
}