import { useState } from "react";
import { Operation } from "../../types";
import ProgressBar from "./ProgressBar";

export function OperationListItem({ operation } : { operation: Operation }) {
    return (
        <div className="break-all p-1 text-xs">
            {operation.source.pathString} -&gt; {operation.destination.pathString}
            <hr/>
            {/* small progress bar */}
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
        <div className="text-sm text-gray-700 py-2" onClick={onClick}>
            {text}
        </div>
    )
}

export function OperationList({ count, children } : { count: number, children: React.ReactNode }) {
    const [showOperations, setShowOperations] = useState(false);
    const handleOnClick = () => setShowOperations(!showOperations);
    return (
        <div className="">
            <OperationsSummaryToggle operationsCount={count} onClick={handleOnClick} showOperations={showOperations}/>
            {showOperations && (<div className="overflow-auto h-[30vh]">{children}</div>)}
        </div>
    )
}
