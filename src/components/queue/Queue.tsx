import { Operation, Queue as QueueType } from "../../types";
import Title from "../common/Title";
import QueueItem from './QueueItem';

export default function Queue({ queue }: { queue: QueueType }) {
    const items: Operation[] = Object.values(queue);
    return (
        <div className="bg-gray-100 dark:bg-gray-800 dark:text-white opacity-75 m-2 p-2 h-[82vh] rounded-md overflow-auto">
            <Title text="Queue" />
            <h2>{items.length} { items.length == 1 ? 'item' : 'items'} in queue</h2>
            <div>
                {items.map(item => (
                    <QueueItem key={item.id} item={item} onCancel={() => {}} />
                ))}
            </div>
        </div>
    );
}