import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react';
import { Path } from '../../App';
import FavoritesList from './FavoritesList';
import useFavorites from '../../utils/useFavorites';
import useDrives from '../../utils/useDrives';
import { PickerMenu, PickerMenuContainer, PickerMenuItem } from './PickerDropDownMenu';
import { BackButton, PathDisplay, Title, ToggleButton } from './Misc';
import { PickerList, PickerListItem } from './PickerList';
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

enum PickerView {
    FAVORITES,
    DRIVES,
    FOLDER_CONTENT
}

function getParentPath(path: string) {
    const parts = path.split('/')
    parts.pop()
    return parts.join('/')
}

export default function Picker({ onChange, foldersOnly, currentPath, label }: PickerProps) {
    const [items, setItems] = useState<FolderContentItem[]>([])
    const [pickerView, setPickerView] = useState<PickerView>(PickerView.FOLDER_CONTENT)

    const [favorites, setFavorites] = useFavorites()
    const drives = useDrives()
    
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
    }

    const handleRemoveFavorite = (path: Path) => {
        setFavorites(favs => favs.filter(fav => fav.path !== path.path))
    }

    const goToPath = (path: Path) => {
        onChange(path)
        setPickerView(PickerView.FOLDER_CONTENT)
    }

    const handleDrivesToggle = () => {
        if (pickerView === PickerView.DRIVES) {
            setPickerView(PickerView.FOLDER_CONTENT)
        } else {
            setPickerView(PickerView.DRIVES)
        }
    }

    const handleFavoritesToggle = () => {
        if (pickerView === PickerView.FAVORITES) {
            setPickerView(PickerView.FOLDER_CONTENT)
        } else {
            setPickerView(PickerView.FAVORITES)
        }
    }

    return (
        <div className="flex flex-col items-stretch m-2 p-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md opacity-75">
            
            {/* Top bar with label and menu items */}
            <div className="flex justify-between items-baseline">
                <Title text={"Select " + label} />
                <div className="flex gap-0">
                    <ToggleButton label="Drives" onClick={handleDrivesToggle} isOn={pickerView == PickerView.DRIVES} />
                    <ToggleButton label="Favorites" onClick={handleFavoritesToggle} isOn={pickerView == PickerView.FAVORITES} />
                    <PickerMenuContainer>
                        <PickerMenu>
                            <PickerMenuItem label="Add to favorites" onClick={handleAddToFavorites}/>
                            <PickerMenuItem label="Open OS picker" onClick={handleOpenOSPicker} />
                            <PickerMenuItem label="Sort by date" onClick={() => {}}/>
                            <PickerMenuItem label="Sort by name" onClick={() => {}}/>
                            <PickerMenuItem label="Sort by size" onClick={() => {}}/>
                        </PickerMenu>
                    </PickerMenuContainer>
                </div>
            </div>

            {/* Path and back button */}
            <div className="flex justify-start gap-1 items-stretch">
                <BackButton onClick={handleBack} />
                <PathDisplay path={currentPath.path} />
            </div>

            {/* List of items from selected path, drives or favorites */}

            {pickerView == PickerView.FOLDER_CONTENT && 
                <PickerList>
                    {items.filter(item => !foldersOnly || foldersOnly && item.isFolder).map(item => {
                        let newPath: Path

                        if (currentPath.type == 'folder') {
                            newPath = { path: currentPath.path + '/' + item.name, type: item.isFolder ? 'folder' : 'file' }
        
                        } else {
                            newPath = { path: getParentPath(currentPath.path)+ '/' + item.name, type: item.isFolder ? 'folder' : 'file' }

                        }

                        const icon = item.isFolder ? '📁' : '📄'
                        const text = icon + ' ' + item.name
                        const pathSelected = currentPath.type == 'file' && currentPath.path == getParentPath(currentPath.path) + '/' + item.name
                        return (
                            <PickerListItem 
                                key={item.name} 
                                text={text} 
                                selected={pathSelected} 
                                onClick={() => onChange(newPath)}
                                showRemoveButton={false}
                            />
                        )
                    })}
                </PickerList>
            }

            {pickerView == PickerView.FAVORITES && (
                <PickerList>
                    {favorites.map(f => 
                        <PickerListItem
                            key={f.path}
                            text={f.path}
                            selected={false}
                            showRemoveButton={true}
                            onRemove={() => handleRemoveFavorite(f)}
                            onClick={() => goToPath(f)}
                            />
                    )}
                </PickerList>
            )}

            {pickerView == PickerView.DRIVES && (
                <PickerList>
                    {drives.map(drive => 
                        <PickerListItem
                            key={drive}
                            text={drive}
                            selected={false}
                            showRemoveButton={false}
                            onClick={() => goToPath({ path: drive, type: 'folder' })}
                            />
                    )}
                </PickerList>
            )}
        </div>
    );
}