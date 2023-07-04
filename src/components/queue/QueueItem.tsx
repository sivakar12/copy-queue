import { useState } from 'react';
import { Operation } from '../../types';
import RoundCloseButton from '../common/RoundCloseButton';
import PathDisplay from './PathDisplay';
import ProgressBar from './ProgressBar';
import { OperationList, OperationListItem } from './OperationsList';

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
    const totalBytes = item.splitOperations?.reduce((acc, op) => acc + (op.totalBytes || 0), 0);
    const bytesCopied = item.splitOperations?.reduce((acc, op) => acc + (op.bytesCopied || 0), 0);
    const progress = bytesCopied || 0 / (totalBytes || 1) * 100;

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

            
            <ProgressBar progress={progress} />

            {/* Progress bar and cancel button */}
            {/* <div className="flex flex-row gap-1 items-center"> 
                <div className="flex-1">
                    <ProgressBar progress={progress} />
                </div>
                <div className="flex-none">
                    <RoundCloseButton onClick={onCancel}/>
                </div>
            </div> */}
            
            {/* {JSON.stringify(item.splitOperations)}  */}
            {item.splitOperations && item.splitOperations.size > 0 && (
                <OperationList count={item.splitOperations.size} >
                    {item.splitOperations.sort(comparator).entrySeq().map(([id, operation]) => (
                        <OperationListItem key={id} operation={operation} />
                    ))}
                </OperationList>
            )}
        </div>
    )
}