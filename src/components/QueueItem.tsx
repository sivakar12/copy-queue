import { QueueItem as QueueItemType } from '../App';

type QueueItemProps = {
    item: QueueItemType;
    onCancel : () => void;
}

function CancelButton({ onCancel }: { onCancel: () => void}) {
    return (
        <div className="bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center" onClick={onCancel}>
            x
        </div>
    )
} 

function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="bg-gray-300 h-4">
            <div style={{ width: `${progress}%` }} className="bg-green-500 h-5"></div>
        </div>
    )
}

function Path({ label, path }: { label: string, path: string }) {
    return (
        <div className="flex justify-between gap-1">
            <div className="text-gray-400 font-light">{label}</div>
            <div className="text-gray-800 font-semibold">{path}</div>
        </div>
    )
}

function Fraction({ numerator, denominator, type }: { numerator: number, denominator: number, type: 'files' | 'bytes' }) {
    return (
        <div className="text-gray-400">
            {numerator} / {denominator} {type}
        </div>
    )
}

export default function({ item, onCancel }: QueueItemProps ) {
    const progress = item.bytesCopied && item.totalBytes ?  item.bytesCopied / item.totalBytes * 100 : 0;

    return (
        
        <div className="flex flex-col p-1 m-1 rounded-md bg-gray-100">
            <div className="flex flex-row justify-stretch"> {/* Labels and paths and fractions */}

                <div className="flex flex-col grow"> {/* Labels and paths */}
                    <Path label="Source" path={item.source} />
                    <Path label="Destination" path={item.destination} />
                </div>
                {/* Fractions */}
                {item.filesCopied && item.bytesCopied && item.totalBytes && item.totalFiles && 
                    <div className="flex flex-col flex-auto">
                        <Fraction numerator={item.filesCopied} denominator={item.totalFiles} type="files" />
                        <Fraction numerator={item.bytesCopied} denominator={item.totalBytes} type="bytes" />
                    </div>
                }
            </div>
            <div className="flex flex-row gap-1"> {/* Progress bar and cancel button */}
                <div className="flex-1">
                    <ProgressBar progress={progress} />
                </div>
                <div className="flex-none">
                    <CancelButton onCancel={onCancel}/>
                </div>
            </div>
            {/* TODO: Add files fraction and bytes fraction */}
        </div>
    )
}