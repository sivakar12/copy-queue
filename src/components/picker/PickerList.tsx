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
    icon?: React.ReactNode;
    onClick: () => void;
    selected: boolean;
    showRemoveButton: boolean;
    onRemove?: () => void;
}
export function PickerListItem({ text, icon, selected, onClick, showRemoveButton, onRemove}: PickerListItemProps) {
    let className = selected ? "bg-blue-400" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                className += " text-gray-800 px-3 py-1 my-1 rounded-3xl overflow-hidden cursor-pointer transition-colors"
                if (!selected) {
                    className += " hover:bg-gray-300 dark:hover:bg-gray-600"
                }
    if (showRemoveButton && onRemove) {
        // TODO: Fix alignment
        className += " flex flex-row justify-between items-center"
        return (
            <div className={className} onClick={onClick}>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    {icon}
                    {text}
                </div>
                <RoundCloseButton onClick={onRemove}/>
            </div>
        )
    } else {
        return (
            <div className={className} onClick={onClick}>
                <div className="flex items-center gap-2">
                    {icon}
                    {text}
                </div>
            </div>
        )
    }
}