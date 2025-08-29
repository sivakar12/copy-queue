import React, { useState } from 'react';

interface PathDisplayProps {
  path: string;
  navigable?: boolean;
  onPathClick?: (newPath: string) => void;
  variant?: 'big' | 'small';
  showFullPath?: boolean;
  label?: string;
}

export const PathDisplay: React.FC<PathDisplayProps> = ({
  path,
  navigable = false,
  onPathClick,
  variant = 'big',
  showFullPath = false,
  label
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  // Parse path into segments, filtering out empty strings
  const segments = path.split('/').filter(segment => segment.length > 0);
  
  // Build cumulative paths for navigation
  const getCumulativePath = (index: number) => {
    return '/' + segments.slice(0, index + 1).join('/');
  };

  const pillClasses = variant === 'big' 
    ? 'px-2 py-1 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
    : 'text-sm font-medium text-gray-700 dark:text-gray-200';

  const navigablePillClasses = variant === 'big' 
    ? `${pillClasses} hover:bg-gray-200 dark:hover:bg-gray-500 cursor-pointer transition-colors duration-200`
    : `${pillClasses} cursor-pointer hover:underline`;
  const nonNavigablePillClasses = `${pillClasses} cursor-default`;

  return (
    <div className="space-y-1">
      {label && (
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
          {label}
        </div>
      )}
      <div className={`flex items-start gap-0.5 flex-wrap relative overflow-visible ${variant === 'small' ? 'gap-y-0.5' : 'gap-y-1'}`}>
        {segments.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg className="w-2.5 h-2.5 text-gray-400 mx-0.5 flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
            </svg>
          )}
          <span
            className={`${navigable ? navigablePillClasses : nonNavigablePillClasses} whitespace-nowrap relative`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
            onClick={() => {
              if (navigable && onPathClick) {
                onPathClick(getCumulativePath(index));
              }
            }}
          >
            {!showFullPath && segment.length > 15 ? (
              <>
                {segment.substring(0, 7)}...{segment.substring(segment.length - 7)}
              </>
            ) : (
              segment
            )}
            {/* Custom tooltip */}
            {!showFullPath && hoveredSegment === index && segment.length > 15 && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
                {segment}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </span>
        </React.Fragment>
      ))}
      </div>
    </div>
  );
};
