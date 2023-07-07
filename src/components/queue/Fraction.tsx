export function Fraction ({ numerator, denominator, type }: { numerator: number, denominator: number, type: 'files' | 'bytes' }) {
    return (
        <div className="text-gray-700 dark:text-gray-400">
            {numerator} / {denominator} {type}
        </div>
    )
}

export function FractionCompact ({ numerator, denominator, type }: { numerator: number, denominator: number, type: 'files' | 'bytes' }) {
    return (
        <span className="text-gray-700 dark:text-gray-400 text-xs">
            {numerator} / {denominator} {type}
        </span>
    )
}