export default function({ onClick, label }: { onClick: () => void, label: string }) {
    return (
      <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded inline-block" onClick={onClick}>
        {label}
      </div>
    )
  }