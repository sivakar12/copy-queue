export default function ({ onClick }: { onClick: () => void }) {
    return (
        <div className="text-lg font-bold p-1 bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-white rounded-md flex justify-center items-center" onClick={onClick}>
            &lt;
        </div>
    )
}