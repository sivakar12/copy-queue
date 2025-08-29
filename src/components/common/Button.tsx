export default function({ onClick, label, className = "", disabled = false }: { onClick: () => void, label: string, className?: string, disabled?: boolean }) {
    const baseClasses = "font-bold py-2 px-6 rounded-3xl inline-block cursor-pointer";
    const defaultClasses = "bg-blue-500 hover:bg-blue-700 text-white";
    const disabledClasses = "bg-gray-400 text-gray-200 cursor-not-allowed";
    
    const finalClasses = disabled 
      ? `${baseClasses} ${disabledClasses} ${className}`
      : `${baseClasses} ${defaultClasses} ${className}`;
    
    return (
      <div className={finalClasses} onClick={disabled ? undefined : onClick}>
        {label}
      </div>
    )
  }