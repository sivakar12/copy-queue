import { Operation } from '../../types';
import { PathDisplay } from '../common/PathDisplay';
import ProgressBar from './ProgressBar';
import { OperationList, OperationListItem } from './OperationsList';
import { Fraction } from './Fraction';

type QueueItemProps = {
    item: Operation;
    onCancel : () => void;
}

export default function({ item, onCancel }: QueueItemProps ) {
    const progress = (item.bytesCopied || 0) / (item.totalBytes || 1) * 100;

    const comparator = (a: Operation, b: Operation) => {
        if (a.id < b.id) {
          return -1
        } else if (a.id > b.id) {
          return 1
        } else {
          return 0
        }
      }
    return (
        
        <div className="flex flex-col px-4 py-2 my-1 rounded-3xl bg-gray-200 dark:bg-gray-700">
            <div className="flex flex-row justify-stretch">     
                <div className="px-2 py-2 rounded-3xl space-y-3">
                    <div className="space-y-1">
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            Source
                        </div>
                        <PathDisplay 
                            path={item.source.pathString}
                            navigable={false}
                            variant="small"
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            Destination
                        </div>
                        <PathDisplay 
                            path={item.destination.pathString}
                            navigable={false}
                            variant="small"
                        />
                    </div>
                </div>
            </div>
            
            <ProgressBar progress={progress} />

            <div className="flex justify-between p-2">
                <Fraction numerator={item.bytesCopied || 0} denominator={item.totalBytes || 0} type="bytes" />
                <Fraction numerator={item.filesCopied || 0} denominator={item.totalFiles || 0} type="files" />
            </div>

            {item.splitOperations && item.splitOperations.size > 1 && (
                <OperationList count={item.splitOperations.size} >
                    {item.splitOperations.sort(comparator).entrySeq().map(([id, operation]) => (
                        <OperationListItem key={id} operation={operation} />
                    ))}
                </OperationList>
            )}
        </div>
    )
}