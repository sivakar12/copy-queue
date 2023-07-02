export default function ({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex items-center justify-center rounded-full">
            <svg className="w-7 h-7 p-1 bg-gray-200 dark:bg-gray-600 rounded-full text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
    )
}