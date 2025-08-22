import React from 'react';

export function FileIcon() {
    return (
        <div>
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5L6 12h12l-5-7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V12" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20" />
            </svg>
        </div>
    );
}

export function FolderIcon() {
    return (
        <div>
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 12h-6m6 0a2 2 0 01-2 2h-6a2 2 0 01-2 2H6a2 2 0 01-2-2H2a2 2 0 01-2-2v-5a2 2 0 012-2h6.586a1 1 0 00.707-0.293l3.414-3.414A2 2 0 0112.414 3H20a2 2 0 012 2v5a2 2 0 010 4z" />
            </svg>
        </div>
    );
}
