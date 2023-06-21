import { Path } from "../../App"
import RoundCloseButton from "../common/RoundCloseButton"
// TODO: Should there be two favorites? One for source and one for destination?

function FavoriteItem({ path, onClick, onRemove }: { path: Path, onClick: () => void, onRemove: () => void}) {
    return (
        <div className="flex flex-row justify-between bg-gray-200 dark:bg-gray-700 dark:text-white cursor-pointer text-gray-800 p-1 my-1 rounded-md" onClick={onClick}>
            <div className="text-gray-700 dark:text-gray-300">{path.path}</div>
            <RoundCloseButton onClick={onRemove} />
        </div>
    )
}

export default function({ favorites, onSelect, onRemove }: { favorites: Path[], onSelect: (path: Path) => void, onRemove: (path: Path) => void }) {
    return (
        <div>
            <div className="flex flex-col">
                {favorites.map((favorite, index) => (
                    <FavoriteItem 
                        key={index}
                        path={favorite} 
                        onClick={() => onSelect(favorite)} 
                        onRemove={() => onRemove(favorite)}
                        />
                ))}
            </div>
        </div>
    )
}