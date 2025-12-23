import React, { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { StreamLanguage } from '@codemirror/language';

// Custom Mermaid syntax highlighting
const mermaidLanguage = StreamLanguage.define({
    token(stream) {
        // Keywords
        if (stream.match(/\b(graph|subgraph|end|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|xychart|block|participant|actor|loop|alt|else|opt|par|and|critical|break|rect|note|over|left|right|of|activate|deactivate|title|section|class|interface|enum|style|linkStyle|classDef|click|callback|direction)\b/)) {
            return 'keyword';
        }
        // Arrows and connections
        if (stream.match(/-->|--|->|<-->|<->|===|===|-.->|==>|--x|--o|\|\|--|\|o--/)) {
            return 'operator';
        }
        // Node shapes
        if (stream.match(/\[[\[\(]/)) {
            return 'bracket';
        }
        if (stream.match(/[\]\)\]]/)) {
            return 'bracket';
        }
        // Quoted strings
        if (stream.match(/"[^"]*"/)) {
            return 'string';
        }
        if (stream.match(/'[^']*'/)) {
            return 'string';
        }
        // Comments
        if (stream.match(/%%.*$/)) {
            return 'comment';
        }
        // Labels in pipes
        if (stream.match(/\|[^|]*\|/)) {
            return 'string';
        }
        // Node IDs (letters and numbers)
        if (stream.match(/[A-Za-z][A-Za-z0-9_]*/)) {
            return 'variable';
        }
        // Skip whitespace and other characters
        stream.next();
        return null;
    }
});

// Light theme
const lightTheme = EditorView.theme({
    '&': {
        backgroundColor: '#ffffff',
        color: '#1f2937',
    },
    '.cm-gutters': {
        backgroundColor: '#f9fafb',
        color: '#9ca3af',
        border: 'none',
    },
    '.cm-activeLineGutter': {
        backgroundColor: '#f3f4f6',
    },
    '.cm-activeLine': {
        backgroundColor: '#f9fafb',
    },
    '.cm-selectionBackground': {
        backgroundColor: '#dbeafe !important',
    },
    '.cm-cursor': {
        borderLeftColor: '#1f2937',
    },
});

// Dark theme overrides
const darkTheme = EditorView.theme({
    '&': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
    },
    '.cm-gutters': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'rgba(255, 255, 255, 0.4)',
        border: 'none',
    },
    '.cm-activeLineGutter': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '.cm-activeLine': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    '.cm-selectionBackground': {
        backgroundColor: 'rgba(99, 102, 241, 0.3) !important',
    },
    '.cm-cursor': {
        borderLeftColor: '#ffffff',
    },
});

export const CodeEditor = ({
    code,
    setCode,
    isDarkMode,
    saveDiagram,
    showToast
}) => {
    const [isCopying, setIsCopying] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const onChange = useCallback((value) => {
        setCode(value);
    }, [setCode]);

    const handleCopyCode = async () => {
        setIsCopying(true);
        try {
            await navigator.clipboard.writeText(code);
            showToast?.('Code copied to clipboard!', 'success');
        } catch (error) {
            showToast?.('Failed to copy code', 'error');
        } finally {
            setIsCopying(false);
        }
    };

    const handleImport = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content === 'string') {
                setCode(content);
                showToast?.(`Imported: ${file.name}`, 'success');
            }
        };
        reader.onerror = () => {
            showToast?.('Failed to read file', 'error');
        };
        reader.readAsText(file);
        // Reset input so same file can be imported again
        event.target.value = '';
    };

    const handleExport = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.mmd';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast?.('Exported: diagram.mmd', 'success');
    };

    const circleButtonClass = `p-2 h-10 w-10 rounded-full transition-all duration-200 flex items-center justify-center
        ${isDarkMode
            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/30'
            : 'bg-black/10 text-black border border-black/20 hover:bg-black/30'
        }
        hover:scale-105`;

    return (
        <>
            {/* Hidden file input for import */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".mmd,.txt"
                onChange={handleImport}
                className="hidden"
            />

            <div className={`relative mt-6 rounded-lg overflow-hidden border transition-all duration-200 ${isDarkMode
                ? 'border-white/10'
                : 'border-gray-200'
                }`}>
                <CodeMirror
                    value={code}
                    height="200px"
                    extensions={[mermaidLanguage]}
                    theme={isDarkMode ? [vscodeDark, darkTheme] : lightTheme}
                    onChange={onChange}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightActiveLine: true,
                        foldGutter: false,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: false,
                        rectangularSelection: true,
                        crosshairCursor: false,
                        highlightSelectionMatches: true,
                    }}
                />

                {/* Floating action buttons - bottom right */}
                <div className="absolute bottom-3 right-3 z-10 flex gap-2">
                    {/* Copy */}
                    <button
                        onClick={handleCopyCode}
                        disabled={isCopying}
                        className={`${circleButtonClass} ${isCopying && 'opacity-50 cursor-not-allowed'}`}
                        title="Copy code"
                    >
                        {isCopying ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                    </button>

                    {/* Import */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={circleButtonClass}
                        title="Import .mmd file"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                    </button>

                    {/* Export */}
                    <button
                        onClick={handleExport}
                        className={circleButtonClass}
                        title="Export .mmd file"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>

                    {/* Save */}
                    <button
                        onClick={saveDiagram}
                        className={circleButtonClass}
                        title="Save diagram (S)"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};
