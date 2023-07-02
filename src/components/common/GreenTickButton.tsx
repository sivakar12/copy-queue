// TODO: Remove on click handler
export default function({ onClick }: { onClick: () => void }) {
    return <div>
        <button onClick={onClick} className="flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        </button>
    </div>
}