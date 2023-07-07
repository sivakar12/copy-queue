import { Operation } from '../../types';
import PathDisplay from './PathDisplay';
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
        
        <div className="flex flex-col p-2 my-1 rounded-md bg-gray-200 dark:bg-gray-700">
            <div className="flex flex-row justify-stretch">     
                <PathDisplay 
                    source={item.source.pathString}
                    destination={item.destination.pathString}
                />
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