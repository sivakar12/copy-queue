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
        <div className="flex flex-col h-full items-stretch bg-gray-100 dark:bg-gray-800 dark:text-white rounded-3xl opacity-75 overflow-hidden">
            
            {/* Top bar with label and menu items */}
            <div className="flex justify-between items-center px-4 py-2 flex-shrink-0">
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
            <div className="flex justify-start px-4 gap-1 items-stretch flex-shrink-0">
                <BackButton onClick={handleBack} />
                <PathDisplay path={currentPath.pathString} />
            </div>

            {/* List of items from selected path, drives or favorites */}
            <div className="flex-1 px-4 pb-2 min-h-0">
                {pickerView == PickerView.FOLDER_CONTENT && 
                    <PickerList>
                        {items.filter(item => !foldersOnly || foldersOnly && item.pathType == PathType.Folder).map(item => {

                            const icon = item.pathType == PathType.Folder ? (
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )
                            const fileName = item.pathString.split('/').pop()
                            return (
                                <PickerListItem 
                                    key={item.pathString} 
                                    text={fileName || ''}
                                    icon={icon}
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
                        {favorites.map(f => {
                            const starIcon = (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            )
                            return (
                                <PickerListItem
                                    key={f.pathString}
                                    text={f.pathString}
                                    icon={starIcon}
                                    selected={false}
                                    showRemoveButton={true}
                                    onRemove={() => handleRemoveFavorite(f)}
                                    onClick={() => goToPath(f)}
                                    />
                            )
                        })}
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
        </div>
    );
}