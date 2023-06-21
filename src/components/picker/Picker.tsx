import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react';
import { Path } from '../../App';
import { text } from 'stream/consumers';
import FavoritesList from './FavoritesList';
import { useFavorites } from '../../utils/useLocalStorage';

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

// TODO: Get a proper order for tailwind classes

function Title({ text }: { text: string }) {
    return (
        <h1 className="text-md font-medium">{text}</h1>
    )
}

function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="text-lg font-bold p-1 bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-white rounded-md flex justify-center items-center" onClick={onClick}>
            &lt;
        </div>
    )
}

function PathDisplay({ path }: { path: string }) {
    return (
        <div className="flex-grow bg-gray-200 text-gray-500 dark:bg-gray-600 bg-gray dark:text-white ml-1 text-lg font-bold flex items-center p-1">{path}</div>
    )
}

function FavoritesToggle({ onClick, isShowing }: { onClick: () => void, isShowing: boolean }) {
    return (
        <div className={`text-xs p-1 m-1 bg-gray-${isShowing ? "300" : "200"} text-gray-500 dark:bg-gray-${isShowing ? "600" : "700"} dark:text-gray-200 rounded-md`} onClick={onClick}>
            Favorites
        </div>
    )
}

function PickerItem({ text, onClick, selected }: { text: string, onClick: () => void, selected: boolean }) {
    let className = selected ? "bg-blue-400" : "bg-gray-200 dark:bg-gray-700 dark:text-white"
    className += " text-gray-800 p-1 my-1 rounded-md overflow-hidden"
    return (
        <div className={className} onClick={onClick}>{text}</div>
    )
}

export default function Picker({ onChange, foldersOnly, currentPath, label }: PickerProps) {
    const [items, setItems] = useState<FolderContentItem[]>([])
    const [showFavorites, setShowFavorites] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [favorites, setFavorites] = useFavorites()

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

    const handleAddToFavorites = () => {
        setFavorites(favs => {
            if (favs.find(fav => fav.path === currentPath.path)) {
                return favs
            }
            return [...favs, currentPath]
        })
    }

    const handleOpenOSPicker = () => {
        alert("Pick with OS file picker")
        setShowMenu(false)
    }

    const handleRemoveFavorite = (path: Path) => {
        setFavorites(favs => favs.filter(fav => fav.path !== path.path))
    }

    const handleFavoriteClick = (path: Path) => {
        onChange(path)
        setShowFavorites(false)
    }

    const PickerMenuItem = ({ label, onClick }: { label: string, onClick: () => void }) => {
        return (
            <div className="text-xs m-0.5 p-0.5 bg-gray-300 hover:bg-gray-400 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-md opacity-100" onClick={onClick}>
                {label}
            </div>
        )
    }
    const PickerMenu = () => {
        return (
            <div className="absolute right-0 top-0 z-50 bg-gray-300 dark:bg-gray-800 dark:text-white p-0.5 m-1 rounded-md opacity-100">
                <PickerMenuItem label="Add to favorites" onClick={handleAddToFavorites}/>
                <PickerMenuItem label="Open OS picker" onClick={handleOpenOSPicker} />
                <PickerMenuItem label="Sort by date" onClick={() => {}}/>
                <PickerMenuItem label="Sort by name" onClick={() => {}}/>
                <PickerMenuItem label="Sort by size" onClick={() => {}}/>

            </div>
        )
    }

    // TODO: Make this reusable
    const PickerMenuContainer = () => (
        <div className="">
            <div className={`text-xs p-1 m-1 bg-gray-${showMenu ? "300" : "200"} text-gray-500 dark:bg-gray-${showMenu ? "600" : "700"} dark:text-gray-200 rounded-md`} onClick={() => setShowMenu(!showMenu)}>
            ⋮
            </div>
            <div className="relative h-0">

                {showMenu && <PickerMenu />}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col items-stretch m-2 p-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md opacity-75">
            <div className="flex justify-between items-baseline">
                <Title text={"Select " + label} />
                <div className="flex gap-0">
                    <FavoritesToggle onClick={() => { setShowFavorites(!showFavorites)}} isShowing={showFavorites} />
                    <PickerMenuContainer/>
                </div>
            </div>
            <div className="flex justify-start gap-1 items-stretch">
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