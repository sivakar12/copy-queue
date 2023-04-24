import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react';

export type FolderContentItem = {
    name: string;
    isFolder: boolean;
}

export type PickerProps = {
    onChange: (newPath: string) => void;
    directoryOnly: boolean;
    currentPath: string;
    label: string;
}

function getParentPath(path: string) {
    const parts = path.split('/')
    parts.pop()
    return parts.join('/')
}

export default function Picker({ onChange, directoryOnly, currentPath, label }: PickerProps) {
    const [items, setItems] = useState<FolderContentItem[]>([])
    
    useEffect(() => {
        invoke<FolderContentItem[]>('list_folder_items', { path: currentPath }).then(items => {
            setItems(items)
        }).catch(err => {
            console.error(err)
        })
    }, [currentPath])



    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Select {label}</h1>
            <button onClick={() => onChange(getParentPath(currentPath))}>back</button>
            <div>{currentPath}</div>
            <ul className="max-h-[120px] overflow-auto">
                {items.map(item => (
                    item.isFolder 
                    ? <li key={item.name} onClick={() => onChange(currentPath + '/' + item.name)}>📁{item.name}</li>
                    : <li key={item.name}>📄{item.name}</li>

                ))}
            </ul>
        </div>
    );
}