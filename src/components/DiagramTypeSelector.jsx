import React, { useState, useRef, useEffect } from 'react';

export const DIAGRAM_TYPE_OPTIONS = [
    { value: 'flowchart', label: 'Flowchart' },
    { value: 'sequence', label: 'Sequence Diagram' },
    { value: 'class', label: 'Class Diagram' },
    { value: 'state', label: 'State Diagram' },
    { value: 'er', label: 'Entity Relationship' },
    { value: 'journey', label: 'User Journey' },
    { value: 'gantt', label: 'Gantt' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'quadrant', label: 'Quadrant Chart' },
    { value: 'requirement', label: 'Requirement Diagram' },
    { value: 'gitgraph', label: 'GitGraph' },
    { value: 'c4', label: 'C4 Diagram', tag: 'Experimental' },
    { value: 'mindmap', label: 'Mindmaps' },
    { value: 'timeline', label: 'Timeline' },
    { value: 'zenuml', label: 'ZenUML' },
    { value: 'sankey', label: 'Sankey', tag: 'New' },
    { value: 'xychart', label: 'XY Chart', tag: 'New' },
    { value: 'block', label: 'Block Diagram', tag: 'New' },
    { value: 'packet', label: 'Packet', tag: 'New' },
    { value: 'kanban', label: 'Kanban', tag: 'New' },
    { value: 'architecture', label: 'Architecture', tag: 'New' },
    { value: 'radar', label: 'Radar', tag: 'New' },
    { value: 'treemap', label: 'Treemap', tag: 'New' }
];

export const DiagramTypeSelector = ({
    selectedType,
    setSelectedType,
    isLoading,
    isDarkMode
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentTypeLabel = DIAGRAM_TYPE_OPTIONS.find(t => t.value === selectedType)?.label || 'Flowchart';

    return (
        <div ref={dropdownRef} className="relative flex items-center">
            {/* Type Selector Button */}
            <button
                type="button"
                onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
                className={`flex items-center gap-1 p-2 text-xs font-medium transition-all duration-200 rounded-md ${isDarkMode
                    ? 'text-white/60 hover:text-white/90 bg-white/10 hover:bg-white/20'
                    : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
                    } ${isLoading && 'cursor-not-allowed opacity-50'}`}
            >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
                </svg>
                <span className="whitespace-nowrap">{currentTypeLabel}</span>
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    className={`absolute top-full left-0 mt-1 min-w-[180px] max-h-[300px] overflow-y-auto rounded-lg shadow-xl border
                        ${isDarkMode
                            ? 'bg-black/95 border-white/20'
                            : 'bg-white border-gray-200'
                        }`}
                    style={{ zIndex: 999 }}
                >
                    {DIAGRAM_TYPE_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setSelectedType(option.value);
                                setIsDropdownOpen(false);
                            }}
                            className={`w-full p-2 text-left text-xs transition-all duration-150 flex items-center justify-between
                                ${selectedType === option.value
                                    ? isDarkMode
                                        ? 'bg-white/20 text-white font-medium'
                                        : 'bg-black/10 text-gray-900 font-medium'
                                    : isDarkMode
                                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span>{option.label}</span>
                            {option.tag && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${option.tag === 'New'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {option.tag}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
