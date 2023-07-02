import { useState } from "react";
import { Operation, OperationType } from "../../types";
import ProgressBar from "./ProgressBar";
import GreenTickButton from "../common/GreenTickButton";

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
        <div className="flex basis-0 overflow-visible p-1 m-1 text-xs font-extrabold uppercase rounded-md bg-gray-200 dark:bg-gray-400">
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
    const progress = operation.bytesCopied || 0 / (operation.totalBytes || 1);
    const complete = operation.bytesCopied && operation.bytesCopied == operation.totalBytes;
    return (
        <div className="my-1">
            <div className="flex items-center text-xs">
                <OperationTypeBadge operationType={operation.operationType}/>
                <OperationFileDisplay pathString={operation.destination.pathString}/>
                {complete && <GreenTickButton onClick={() => {}}/>}
            </div>
            <ProgressBar progress={progress}/>
        </div>
    )
}

type OperationsSummaryToggleProps = {
    operationsCount: number;
    onClick: () => void;
    showOperations: boolean;
}

function OperationsSummaryToggle({ operationsCount, onClick, showOperations } : OperationsSummaryToggleProps) {
    const prefixSymbol = showOperations ? '🔽' : '▶️';
    const text = `${prefixSymbol} ${operationsCount} ${operationsCount == 1 ? 'operation' : 'operations'}`;
    return (
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 py-1" onClick={onClick}>
            {text}
        </div>
    )
}

export function OperationList({ count, children } : { count: number, children: React.ReactNode }) {
    const [showOperations, setShowOperations] = useState(false);
    const handleOnClick = () => setShowOperations(!showOperations);
    return (
        <div className="dark:bg-gray-600 rounded-md p-1 my-1">
            <OperationsSummaryToggle operationsCount={count} onClick={handleOnClick} showOperations={showOperations}/>
            {showOperations && (<div className="overflow-auto h-[30vh]">{children}</div>)}
        </div>
    )
}
