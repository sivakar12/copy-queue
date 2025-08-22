type PathDisplayPropType = {
    source: string;
    destination: string;
    allowRename?: boolean;
}

export default function Path({ source, destination }: PathDisplayPropType) {
    return (
        <div className="px-4 py-2 rounded-3xl space-y-3">
            <div className="space-y-1">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Source
                </div>
                <div className="text-gray-800 dark:text-gray-200 font-medium break-all">
                    {source}
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Destination
                </div>
                <div className="text-gray-800 dark:text-gray-200 font-medium break-all">
                    {destination}
                </div>
            </div>
        </div>
    )
}