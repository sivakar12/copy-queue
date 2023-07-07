export default function ({ numerator, denominator, type }: { numerator: number, denominator: number, type: 'files' | 'bytes' }) {
    return (
        <div className="text-gray-400 dark:text-gray-700">
            {numerator} / {denominator} {type}
        </div>
    )
}