export default function({ onClick }: { onClick: () => void }) {
    return (
        <div>
            <div className="bg-red-500 hover:bg-red-600 text-white dark:text-black rounded-full h-4 w-4 flex items-center justify-center text-xs cursor-pointer transition-colors" onClick={onClick}>
            ⛌
            </div>
        </div>
    )
}