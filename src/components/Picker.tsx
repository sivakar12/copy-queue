import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react';
import { Path } from '../App';
import { text } from 'stream/consumers';
import FavoritesList from './FavoritesList';
import { useFavorites } from '../utils/useLocalStorage';

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

function Title({ text }: { text: string }) {
    return (
        <h1 className="text-md font-medium">{text}</h1>
    )
}

function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="text-xs p-1 cursor-pointer bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-white rounded-md" onClick={onClick}>
            &lt;
        </div>
    )
}

function PathDisplay({ path }: { path: string }) {
    return (
        <div className="text-gray-800 dark:text-white ml-1 text-lg font-extrabold">{path}</div>
    )
}

function FavoriteButton({ onClick, label }: { onClick: () => void, label: string }) {
    return (
        <div className="text-xs p-1 m-1 cursor-pointer bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md" onClick={onClick}>
            {label}
        </div>
    )
}

function PickerItem({ text, onClick, selected }: { text: string, onClick: () => void, selected: boolean }) {
    let className = selected ? "bg-blue-400" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
    className += " cursor-pointer text-gray-800 p-1 my-1 rounded-md"
    return (
        <div className={className} onClick={onClick}>{text}</div>
    )
}

export default function Picker({ onChange, foldersOnly, currentPath, label }: PickerProps) {
    const [items, setItems] = useState<FolderContentItem[]>([])
    const [showFavorites, setShowFavorites] = useState(false)
    const [favorites, setFavorites] = useFavorites();

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

    const handleRemoveFavorite = (path: Path) => {
        setFavorites(favs => favs.filter(fav => fav.path !== path.path))
    }

    const handleFavoriteClick = (path: Path) => {
        onChange(path)
        setShowFavorites(false)
    }

    return (
        <div className="flex flex-col items-stretch m-2 p-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md opacity-90">
            <div className="flex justify-between items-baseline">
                <Title text={"Select " + label} />
                <div className="flex gap-0">
                    {!showFavorites && <FavoriteButton onClick={() => { setShowFavorites(true)}} label="Select favorites" /> }
                    {showFavorites && <FavoriteButton onClick={() => { setShowFavorites(false)}} label="Close favorites" /> }
                    <FavoriteButton onClick={() => { setFavorites(favs => [...favs, currentPath])}} label="Add to favorites" />
                </div>
            </div>
            <div className="flex justify-start gap-1">
                <BackButton onClick={handleBack} />
                <PathDisplay path={currentPath.path} />
            </div>

            {!showFavorites && <div className="max-h-[160px] overflow-auto">
                {items.filter(item => !foldersOnly || foldersOnly && item.isFolder).map(item => {
                    let newPath: Path

                    if (currentPath.type == 'folder') {
                        newPath = { path: currentPath.path + '/' + item.name, type: item.isFolder ? 'folder' : 'file' }
      
                    } else {
                        newPath = { path: getParentPath(currentPath.path)+ '/' + item.name, type: item.isFolder ? 'folder' : 'file' }

                    }

                    const icon = item.isFolder ? '📁' : '📄'
                    const pathSelected = currentPath.type == 'file' && currentPath.path == getParentPath(currentPath.path) + '/' + item.name
                    return  <PickerItem key={item.name} text={icon + ' ' + item.name} selected={pathSelected} onClick={() => onChange(newPath)}/>
                })}

            </div> }

            {showFavorites && (
                <FavoritesList 
                    favorites={favorites} 
                    onSelect={(path: Path) => handleFavoriteClick(path)}
                    onRemove={path => handleRemoveFavorite(path)} />
                
            )}
        </div>
    );
}