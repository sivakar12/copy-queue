import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react';

export type FolderContentItem = {
    name: string;
    isDirectory: boolean;
}

export type PickerProps = {
    onChange: (value: string) => void;
    directoryOnly: boolean;
    value: string;
    label: string;
}

export default function Picker({ onChange, directoryOnly, value, label }: PickerProps) {
    const [items, setItems] = useState<FolderContentItem[]>([])
    
    useEffect(() => {
        invoke<FolderContentItem[]>('list_folder_items', { path: value, directoryOnly }).then(items => {
            setItems(items)
        }).catch(err => {
            console.error(err)
        })
    }, [value])
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Select {label}</h1>
            {/* <button>back</button> */}
            <div>{value}</div>
            <ul>
                {JSON.stringify(items)}
            </ul>
        </div>
    );
}