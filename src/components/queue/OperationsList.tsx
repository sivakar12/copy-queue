import { useState } from "react";
import { Operation, OperationType } from "../../types";
import ProgressBar from "./ProgressBar";
import GreenTickButton from "../common/GreenTickButton";
import { Fraction, FractionCompact} from "./Fraction";
import { DropdownClosed, DropdownOpen } from "../common/DropdownToggles";
import { PathDisplay } from "../common/PathDisplay";
import { BlueLabel } from "../common/BlueLabel";

function OperationTypeBadge({ operationType } : {operationType: OperationType}) {
    let stringForm;
    let bgColor;
    
    switch (operationType) {
        case OperationType.Copy:
            stringForm = 'Copy';
            bgColor = 'bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-200';
            break;
        case OperationType.CreateFolder:
            stringForm = 'Create folder';
            bgColor = 'bg-yellow-50 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-200';
            break;
        case OperationType.Delete:  
            stringForm = 'Delete';
            bgColor = 'bg-red-50 dark:bg-red-800 text-red-600 dark:text-red-200';
            break;
        case OperationType.Move:
            stringForm = 'Move';
            bgColor = 'bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200';
            break;
    }

    return (
        <div className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${bgColor} shadow-sm`}>
            {stringForm}
        </div>
    )
}

function OperationFileDisplay({ pathString } : { pathString: string }) {
    return (
        <div className="flex justify-start items-center px-1.5">
            <PathDisplay 
                path={pathString} 
                navigable={false}
                variant="small"
                showFullPath={true}
            />
        </div>
    )
}

export function OperationListItem({ operation } : { operation: Operation }) {
    // TODO: Remove hardcoded things
    const progress = (operation.bytesCopied || 0) / (operation.totalBytes || 1) * 100;
    const complete = operation.bytesCopied && operation.bytesCopied == operation.totalBytes;
    return (
        <div className="my-2 flex flex-col">
            <div className="flex justify-between items-baseline mb-0.5">
                <div className="px-1">
                    <OperationTypeBadge operationType={operation.operationType}/>
                </div>
                <div className="flex items-center gap-2">
                    {operation.operationType == OperationType.Copy && 
                        <div className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 shadow-sm">
                            <FractionCompact 
                                numerator={operation.bytesCopied || 0} 
                                denominator={operation.totalBytes || 0} 
                                type="bytes" 
                            />
                        </div>
                    }
                    {complete == true && <GreenTickButton onClick={() => {}}/>}
                </div>
            </div>
            <div className="mt-0">
                <OperationFileDisplay pathString={operation.destination.pathString}/>
            </div>
            {operation.operationType == OperationType.Copy && 
                <ProgressBar progress={progress}/>
            }
        </div>
    )
}

type OperationsSummaryToggleProps = {
    operationsCount: number;
    onClick: () => void;
    showOperations: boolean;
}

function OperationsSummaryToggle({ operationsCount, onClick, showOperations } : OperationsSummaryToggleProps) {
    const Symbol = showOperations ? DropdownOpen : DropdownClosed
    const text = `${operationsCount} ${operationsCount == 1 ? 'operation' : 'operations'}`;
    return (
        <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={onClick}>
            <Symbol/>
            <BlueLabel text={text} variant="small" />
        </div>
    )
}

export function OperationList({ count, children } : { count: number, children: React.ReactNode }) {
    const [showOperations, setShowOperations] = useState(false);
    const handleOnClick = () => setShowOperations(!showOperations);
    return (
        <div className="bg-gray-300 dark:bg-gray-600 rounded-3xl px-3 py-3 my-1">
            <OperationsSummaryToggle operationsCount={count} onClick={handleOnClick} showOperations={showOperations}/>
            {showOperations && (<div className="overflow-auto h-[30vh]">{children}</div>)}
        </div>
    )
}
