import { useState } from "react";
import { Operation, OperationType } from "../../types";
import ProgressBar from "./ProgressBar";
import GreenTickButton from "../common/GreenTickButton";
import { Fraction, FractionCompact} from "./Fraction";
import { DropdownClosed, DropdownOpen } from "../common/DropdownToggles";

function OperationTypeBadge({ operationType } : {operationType: OperationType}) {
    let stringForm;
    switch (operationType) {
        case OperationType.Copy:
            stringForm = 'Copy';
            break;
        case OperationType.CreateFolder:
            stringForm = 'Create folder';
            break;
        case OperationType.Delete:  
            stringForm = 'Delete';
            break;
    }

    return (
                    <div className="flex flex-1 overflow-visible px-3 py-1 m-1 text-xs font-extrabold uppercase rounded-3xl bg-gray-400 dark:bg-gray-400">
            {stringForm}
        </div>
    )
}

function OperationFileDisplay({ pathString } : { pathString: string }) {
    return (
        <div className="flex justify-center items-center break-all p-1">
            {pathString}
        </div>
    )
}

export function OperationListItem({ operation } : { operation: Operation }) {
    // TODO: Remove hardcoded things
    const progress = (operation.bytesCopied || 0) / (operation.totalBytes || 1) * 100;
    const complete = operation.bytesCopied && operation.bytesCopied == operation.totalBytes;
    return (
        <div className="my-1 flex flex-col items-stretch">
            <div className="flex items-between items-center text-xs">
                <OperationTypeBadge operationType={operation.operationType}/>
                <div className="flex flex-col">
                    <OperationFileDisplay pathString={operation.destination.pathString}/>
                    <div className="self-end">
                        {operation.operationType == OperationType.Copy && 
                            <FractionCompact 
                                numerator={operation.bytesCopied || 0} 
                                denominator={operation.totalBytes || 0} 
                                type="bytes" 
                            />
                        }
                    </div>
                </div>
                {complete == true && <GreenTickButton onClick={() => {}}/>}
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
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 py-1">
                {text}
            </div>
        </div>
    )
}

export function OperationList({ count, children } : { count: number, children: React.ReactNode }) {
    const [showOperations, setShowOperations] = useState(false);
    const handleOnClick = () => setShowOperations(!showOperations);
    return (
                    <div className="bg-gray-300 dark:bg-gray-600 rounded-3xl px-3 py-1 my-1">
            <OperationsSummaryToggle operationsCount={count} onClick={handleOnClick} showOperations={showOperations}/>
            {showOperations && (<div className="overflow-auto h-[30vh]">{children}</div>)}
        </div>
    )
}
