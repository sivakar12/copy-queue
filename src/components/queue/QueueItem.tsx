import { Operation } from '../../types';
import RoundCloseButton from '../common/RoundCloseButton';
import PathDisplay from './PathDisplay';
import ProgressBar from './ProgressBar';

type QueueItemProps = {
    item: Operation;
    onCancel : () => void;
}

function Fraction({ numerator, denominator, type }: { numerator: number, denominator: number, type: 'files' | 'bytes' }) {
    return (
        <div className="text-gray-400 dark:text-gray-700">
            {numerator} / {denominator} {type}
        </div>
    )
}

export default function({ item, onCancel }: QueueItemProps ) {
    const progress = item.bytesCopied && item.totalBytes ?  item.bytesCopied / item.totalBytes * 100 : 0;

    return (
        
        <div className="flex flex-col p-2 my-1 rounded-md bg-gray-200 dark:bg-gray-700">
            <div className="flex flex-row justify-stretch"> {/* Labels and paths and fractions */}

                <PathDisplay 
                    source={item.source.pathString}
                    destination={item.destination.pathString}
                />
                {/* {item.filesCopied && item.bytesCopied && item.totalBytes && item.totalFiles &&  */}
                {item.bytesCopied && item.totalBytes && 
                    <div className="flex flex-col flex-auto">
                        {/* <Fraction numerator={item.filesCopied} denominator={item.totalFiles} type="files" /> */}
                        <Fraction numerator={item.bytesCopied} denominator={item.totalBytes} type="bytes" />
                    </div>
                }
            </div>
            <div className="flex flex-row gap-1"> {/* Progress bar and cancel button */}
                <div className="flex-1">
                    <ProgressBar progress={progress} />
                </div>
                <div className="flex-none">
                    <RoundCloseButton onClick={onCancel}/>
                </div>
            </div>
            {/* TODO: Add subtasks and toggle to see sub tasks */}
        </div>
    )
}