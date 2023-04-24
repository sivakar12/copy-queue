import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react';
import { Path } from '../App';

export type FolderContentItem = {
    name: string;
    isFolder: boolean;
}

export type PickerProps = {
    onChange: (newPath: Path) => void;
    foldersOnly: boolean;
    currentPath: Path;
    label: string;
}

function getParentPath(path: string) {
    const parts = path.split('/')
    parts.pop()
    return parts.join('/')
}

export default function Picker({ onChange, foldersOnly, currentPath, label }: PickerProps) {
    const [items, setItems] = useState<FolderContentItem[]>([])

    useEffect(() => {
        if (currentPath.type === 'file') {
            return
        }
        invoke<FolderContentItem[]>('list_folder_items', { path: currentPath.path }).then(items => {
            setItems(items)
        }).catch(err => {
            console.error(err)
        })
    }, [currentPath])

    const handleBack = () => {
        const newPath: Path = {
            path: getParentPath(currentPath.path),
            type: 'folder'
        }
        onChange(newPath)
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Select {label}</h1>
            <button onClick={handleBack}>back</button>
            <div>{currentPath.path}</div>
            <ul className="max-h-[120px] overflow-auto">
                {items.filter(item => !foldersOnly || foldersOnly && item.isFolder).map(item => {
                    let props;

                    if (currentPath.type == 'folder') {
                        const newPath: Path = { path: currentPath.path + '/' + item.name, type: item.isFolder ? 'folder' : 'file' }
                        props = {
                            onClick: () => {onChange(newPath)},
                        }
                    } else {
                        const newPath: Path = { path: getParentPath(currentPath.path)+ '/' + item.name, type: item.isFolder ? 'folder' : 'file' }
                        props = {
                            onClick: () => {onChange(newPath)}
                        }
                    }

                    const icon = item.isFolder ? '📁' : '📄'
                    const className = currentPath.type == 'file' && currentPath.path == getParentPath(currentPath.path) + '/' + item.name ? 'bg-blue-500' : ''
                    return  <li {...props} key={item.name} className={className} >{icon} {item.name}</li>

                })}
            </ul>
        </div>
    );
}