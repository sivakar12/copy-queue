import { QueueItem as QueueItemType } from "../../App";
import QueueItem from './QueueItem';

type QueueProps = {
    items: QueueItemType[];
}

export default function Queue({ items }: QueueProps) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 dark:text-white opacity-75 p-2 rounded-md w-full h-full overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Queue</h1>
            <h2>{items.length} { items.length == 1 ? 'item' : 'items'} in queue</h2>
            <div>
                {items.map(item => (
                    <QueueItem key={item.id} item={item} onCancel={() => {}} />
                ))}
            </div>
        </div>
    );
}