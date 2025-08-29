interface BlueLabelProps {
  text: string;
  variant?: 'big' | 'small';
}

export const BlueLabel: React.FC<BlueLabelProps> = ({ 
  text, 
  variant = 'big' 
}) => {
  const baseClasses = "font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide";
  const sizeClasses = variant === 'big' 
    ? 'text-lg' 
    : 'text-xs';

  return (
    <div className={`${baseClasses} ${sizeClasses}`}>
      {text}
    </div>
  );
};
