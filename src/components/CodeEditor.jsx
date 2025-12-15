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
    saveDiagram
}) => {
    const onChange = useCallback((value) => {
        setCode(value);
    }, [setCode]);

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
            <button
                onClick={saveDiagram}
                className={`mt-2 px-4 sm:px-5 py-2 sm:py-3 rounded-lg transition-all duration-200 ${isDarkMode
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                title="Save diagram (S)"
            >
                Save
            </button>
        </>
    );
};
