import { Operation, Queue as QueueType } from "../../types";
import Title from "../common/Title";
import QueueItem from './QueueItem';

export default function Queue({ queue }: { queue: QueueType }) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 dark:text-white opacity-75 m-2 p-2 h-[82vh] rounded-md overflow-auto">
            <Title text="Queue" />
            <h2>{queue.size} { queue.size == 1 ? 'item' : 'items'} in queue</h2>
            <div>
                {queue.entrySeq().map(([id, operation]) => (
                    <QueueItem key={id} item={operation} onCancel={() => {}}/>
                ))}
            </div>
        </div>
    );
}