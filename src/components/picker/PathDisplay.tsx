export default function ({ path }: { path: string }) {
    return (
        <div className="flex-grow bg-gray-200 text-gray-500 dark:bg-gray-600 bg-gray dark:text-white ml-1 text-md font-bold flex items-center p-1 break-all space-y-0 rounded-3xl">{path}</div>
    )
}