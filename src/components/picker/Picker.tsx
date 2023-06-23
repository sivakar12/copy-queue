import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react';
import useFavorites from '../../utils/useFavorites';
import useDrives from '../../utils/useDrives';
import { PickerMenu, PickerMenuContainer, PickerMenuItem } from './PickerDropDownMenu';
import { PickerList, PickerListItem } from './PickerList';
import ToggleButton from './ToggleButton';
import BackButton from './BackButton';
import PathDisplay from './PathDisplay';
import Title from '../common/Title';
import { Path, PathType } from '../../types';


export type PickerProps = {
    onChange: (newPath: Path) => void;
    foldersOnly?: boolean;
    currentPath: Path;
    label: string;
}

enum PickerView {
    FAVORITES,
    DRIVES,
    FOLDER_CONTENT
}

function getParentPath(path: Path): Path {
    if (path.pathString === '/') {
        return path
    }
    const pathParts = path.pathString.split('/')
    pathParts.pop()
    const parentPath = pathParts.join('/')
    return {
        pathString: parentPath,
        pathType: PathType.Folder
    }
}

export default function Picker({ onChange, foldersOnly, currentPath, label }: PickerProps) {
    const [items, setItems] = useState<Path[]>([])
    const [pickerView, setPickerView] = useState<PickerView>(PickerView.FOLDER_CONTENT)

    const [favorites, setFavorites] = useFavorites()
    const drives = useDrives()
    
    useEffect(() => {
        let pathToShowItems: Path
        if (currentPath.pathType === PathType.File) {
            pathToShowItems = getParentPath(currentPath)
        } else {
            pathToShowItems = currentPath
        }
        console.log('viewing folder', pathToShowItems)
        invoke<Path[]>('list_folder_items', { path: pathToShowItems} ).then(items => {
            console.log('folder content: ', items)   
            setItems(items)
        }).catch(err => {
            console.error(err)
        })
    }, [currentPath])

    const handleBack = () => {
        onChange(getParentPath(currentPath))
    }

    const handleAddToFavorites = () => {
        setFavorites(favs => {
            if (favs.find(fav => fav.pathString === currentPath.pathString)) {
                return favs
            }
            return [...favs, currentPath]
        })
    }

    const handleOpenOSPicker = () => {
        alert("Pick with OS file picker")
    }

    const handleRemoveFavorite = (path: Path) => {
        setFavorites(favs => favs.filter(fav => fav.pathString !== path.pathString))
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
            <div className="flex justify-between items-center">
                <Title text={label} />
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
                <PathDisplay path={currentPath.pathString} />
            </div>

            {/* List of items from selected path, drives or favorites */}

            {pickerView == PickerView.FOLDER_CONTENT && 
                <PickerList>
                    {items.filter(item => !foldersOnly || foldersOnly && item.pathType == PathType.Folder).map(item => {

                        const icon = item.pathType == PathType.Folder ? '📁' : '📄'
                        const text = icon + ' ' + item.pathString.split('/').pop()
                        return (
                            <PickerListItem 
                                key={item.pathString} 
                                text={text} 
                                selected={item.pathString === currentPath.pathString} 
                                onClick={() => onChange(item)}
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
                            key={f.pathString}
                            text={f.pathString}
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
                            key={drive.pathString}
                            text={drive.pathString}
                            selected={false}
                            showRemoveButton={false}
                            onClick={() => goToPath(drive)}
                            />
                    )}
                </PickerList>
            )}
        </div>
    );
}