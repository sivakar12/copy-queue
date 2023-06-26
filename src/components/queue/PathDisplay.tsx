type PathDisplayPropType = {
    source: string;
    destination: string;
    allowRename?: boolean;
}

function PathLabel({ text }: { text: string }) {
    return (
        <div className=" text-gray-600 dark:text-gray-300 font-light self-left">
            {text}
        </div>
    )
}

function PathValue({ text }: { text: string }) {
    return (
        <div className="text-gray-800 dark:text-gray-200 font-semibold self-right flex-grow break-all">
            {text}
        </div>
    )
}
export default function Path({ source, destination }: PathDisplayPropType) {
    return (
        <div className="grid gap-2 grid-cols-[auto,1fr] p-2 rounded-md">
            <PathLabel text="Source" />
            <PathValue text={source} />
            <PathLabel text="Destination" />
            <PathValue text={destination} />
        </div>
    )
}