export default function({ onClick, label }: { onClick: () => void, label: string }) {
    return (
      <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block cursor-pointer" onClick={onClick}>
        {label}
      </div>
    )
  }