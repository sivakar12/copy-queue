import RoundCloseButton from "../common/RoundCloseButton";


type PickerListProps = {
    children: React.ReactNode;
}

export function PickerList({ children }: PickerListProps) {
    return (
        <div className="overflow-auto h-full">
            {children}
        </div>
    )
}

type PickerListItemProps = {
    text: string;
    onClick: () => void;
    selected: boolean;
    showRemoveButton: boolean;
    onRemove?: () => void;
}
export function PickerListItem({ text, selected, onClick, showRemoveButton, onRemove}: PickerListItemProps) {
    let className = selected ? "bg-blue-400" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
    className += " text-gray-800 p-1 my-1 rounded-md overflow-hidden"
    if (showRemoveButton && onRemove) {
        // TODO: Fix alignment
        className += " flex flex-row justify-between items-center"
        return (
            <div className={className} onClick={onClick}>
                <div className="text-gray-700 dark:text-gray-300">{text}</div>
                <RoundCloseButton onClick={onRemove}/>
            </div>
        )
    } else {
        return (
            <div className={className} onClick={onClick}>{text}</div>
        )
    }
}