import { useState } from "react";

type PickerDropDownMenuContainerProps = {
    children: React.ReactNode;
}

export function PickerMenuContainer(props: PickerDropDownMenuContainerProps) {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div className="">
            <div className={`text-xs p-1 m-1 bg-gray-${showMenu ? "300" : "200"} text-gray-500 dark:bg-gray-${showMenu ? "600" : "700"} dark:text-gray-200 rounded-md`} onClick={() => setShowMenu(!showMenu)}>
                ⋮
            </div>
            <div className="relative h-0">
                {showMenu && props.children}
            </div>
        </div>
    )
}

type PickerDropDownMenuProps = {
    children: React.ReactNode;
}

export function PickerMenu(props: PickerDropDownMenuProps) {
    return (
        <div className="absolute right-0 top-0 z-50 bg-gray-300 dark:bg-gray-800 dark:text-white p-0.5 m-1 rounded-md opacity-100">
            {props.children}
        </div>
    )
}

type PickerDropDownMenuItemProps = {
    label: string;
    onClick: () => void;
}

export const PickerMenuItem = ({ label, onClick }: PickerDropDownMenuItemProps) => {
    return (
        <div className="text-xs m-0.5 p-0.5 bg-gray-300 hover:bg-gray-400 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-md opacity-100" onClick={onClick}>
            {label}
        </div>
    )
}