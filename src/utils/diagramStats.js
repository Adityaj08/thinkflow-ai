// Parse Mermaid code to extract statistics
export const parseDiagramStats = (code) => {
    if (!code) return { nodeCount: 0, edgeCount: 0, diagramType: 'unknown' };

    const lines = code.trim().split('\n');
    const firstLine = lines[0]?.toLowerCase() || '';

    // Detect diagram type
    let diagramType = 'flowchart';
    if (firstLine.startsWith('graph') || firstLine.startsWith('flowchart')) {
        diagramType = 'flowchart';
    } else if (firstLine.startsWith('sequencediagram')) {
        diagramType = 'sequence';
    } else if (firstLine.startsWith('classdiagram')) {
        diagramType = 'class';
    } else if (firstLine.startsWith('statediagram')) {
        diagramType = 'state';
    } else if (firstLine.startsWith('erdiagram')) {
        diagramType = 'ER';
    } else if (firstLine.startsWith('journey')) {
        diagramType = 'journey';
    } else if (firstLine.startsWith('gantt')) {
        diagramType = 'gantt';
    } else if (firstLine.startsWith('pie')) {
        diagramType = 'pie';
    } else if (firstLine.startsWith('mindmap')) {
        diagramType = 'mindmap';
    } else if (firstLine.startsWith('timeline')) {
        diagramType = 'timeline';
    } else if (firstLine.startsWith('gitgraph')) {
        diagramType = 'gitgraph';
    } else if (firstLine.startsWith('quadrantchart')) {
        diagramType = 'quadrant';
    } else if (firstLine.startsWith('requirementdiagram')) {
        diagramType = 'requirement';
    } else if (firstLine.startsWith('c4context') || firstLine.startsWith('c4container') || firstLine.startsWith('c4component') || firstLine.startsWith('c4dynamic')) {
        diagramType = 'C4';
    } else if (firstLine.startsWith('sankey')) {
        diagramType = 'sankey';
    } else if (firstLine.startsWith('xychart')) {
        diagramType = 'XY chart';
    } else if (firstLine.startsWith('block')) {
        diagramType = 'block';
    }

    // Count nodes - look for node definitions like A[text], B{text}, C((text)), etc.
    const nodePattern = /[A-Za-z_][A-Za-z0-9_]*[\[\(\{<]/g;
    const nodeMatches = code.match(nodePattern) || [];
    const uniqueNodes = new Set(nodeMatches.map(n => n.slice(0, -1)));

    // Also count standalone node IDs at start of arrows
    const arrowNodePattern = /\b([A-Za-z_][A-Za-z0-9_]*)\s*(?:-->|->|==>|-.->|--o|--x|<--|<->)/g;
    let match;
    while ((match = arrowNodePattern.exec(code)) !== null) {
        uniqueNodes.add(match[1]);
    }

    // Count edges - look for arrow patterns
    const edgePatterns = [
        /-->/g,      // standard arrow
        /->/g,       // simple arrow
        /==>/g,      // thick arrow
        /-.->|-->/g, // dotted arrow
        /--o/g,      // circle end
        /--x/g,      // cross end
        /<-->/g,     // bidirectional
        /<--/g,      // reverse arrow
        /---/g,      // line (no arrow)
        /\|>/g,      // inheritance (class diagram)
        /\.\./g,     // dotted line (sequence)
        /->>|-->>|-\)/g  // sequence arrows
    ];

    let edgeCount = 0;
    edgePatterns.forEach(pattern => {
        const matches = code.match(pattern);
        if (matches) edgeCount += matches.length;
    });

    // For sequence diagrams, count ->> patterns
    if (diagramType === 'sequence') {
        const seqArrows = code.match(/->>|-->>|-\)/g);
        edgeCount = seqArrows ? seqArrows.length : 0;
    }

    return {
        nodeCount: uniqueNodes.size,
        edgeCount: Math.max(0, edgeCount),
        diagramType
    };
};
