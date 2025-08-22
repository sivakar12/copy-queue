import { Operation, Queue as QueueType } from "../../types";
import Title from "../common/Title";
import QueueItem from './QueueItem';

export default function Queue({ queue }: { queue: QueueType }) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 dark:text-white opacity-75 h-full rounded-3xl overflow-auto">
            <div className="px-4 py-2">
                <Title text="Queue" />
                <div className="text-sm text-gray-700 dark:text-gray-400">
                    {queue.size} { queue.size == 1 ? 'item' : 'items'} in queue
                </div>
            </div>
            <div className="px-2 pb-2">
                {queue.entrySeq().map(([id, operation]) => (
                    <QueueItem key={id} item={operation} onCancel={() => {}}/>
                ))}
            </div>
        </div>
    );
}