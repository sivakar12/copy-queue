import { QueueItem } from "../App";

type QueueProps = {
    items: QueueItem[];
}

export default function Queue({ items }: QueueProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Queue</h1>
            <h2>{items.length} { items.length == 1 ? 'item' : 'items'} in queue</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.source} - {item.destination}
                    </li>
                ))}
            </ul>
        </div>
    );
}