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

    return (
        <>
            <div className={`mt-6 rounded-lg overflow-hidden border transition-all duration-200 ${isDarkMode
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
            </div>
            <div className="flex gap-2 mt-2">
                <button
                    onClick={saveDiagram}
                    className={`px-4 sm:px-5 py-2 sm:py-3 rounded-lg transition-all duration-200 ${isDarkMode
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    title="Save diagram (S)"
                >
                    Save
                </button>
                <button
                    onClick={handleCopyCode}
                    disabled={isCopying}
                    className={`px-4 sm:px-5 py-2 sm:py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${isDarkMode
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-200 hover:bg-gray-300'
                        } ${isCopying && 'opacity-50 cursor-not-allowed'}`}
                    title="Copy code to clipboard"
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
                    Copy Code
                </button>
            </div>
        </>
    );
};
