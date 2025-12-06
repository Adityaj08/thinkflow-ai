import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const useDiagramGen = ({
    code,
    setCode,
    setHistory,
    setHistoryIndex,
    history,
    orientation,
    resetView,
    showToast,
    setIsEditInputOpen,
    setEditInputValue,
    useApiKey1,
    historyIndex
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [explanation, setExplanation] = useState("");

    const generateDiagram = async (prompt, isProcessingRef) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        try {
            setIsLoading(true);
            const apiKey = useApiKey1 ? import.meta.env.VITE_GEMINI_API_KEY1 : import.meta.env.VITE_GEMINI_API_KEY2;

            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate only Mermaid.js code without any explanation or markdown formatting for this diagram: ${prompt}. 
                       Do not include \`\`\`mermaid or any other markdown. Only output the actual mermaid code.
                       The diagram should use ${orientation} orientation.`,
            });
            const generated = response.text || "graph TD\nA --> B";

            // Ensure the generated code has the correct orientation
            const cleanCode = generated.replace(/```(?:mermaid)?\n?|\n?```/g, '').trim();
            const codeWithOrientation = cleanCode.replace(/graph (TD|LR|BT|RL)/, `graph ${orientation}`);
            setCode(codeWithOrientation);

            // Reset history for new diagram generation
            setHistory([codeWithOrientation]);
            setHistoryIndex(0);

            await resetView(codeWithOrientation);
        } catch (error) {
            console.error('Error:', error);
            showToast?.("Failed to generate diagram", "error");
        } finally {
            setIsLoading(false);
            isProcessingRef.current = false;
        }
    };

    const updateDiagram = async (updatePrompt, isProcessingRef) => {
        // Close input box immediately - handled by caller or here if we have setters
        setIsEditInputOpen(false);
        setEditInputValue("");

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            setIsLoading(true);
            const apiKey = useApiKey1 ? import.meta.env.VITE_GEMINI_API_KEY1 : import.meta.env.VITE_GEMINI_API_KEY2;

            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Update this Mermaid.js diagram based on the following request: "${updatePrompt}".
                                
                                Current Diagram Code:
                                ${code}

                                Return ONLY the updated Mermaid.js code without any explanation or markdown formatting.
                                Do not include \`\`\`mermaid or any other markdown. Only output the actual mermaid code.
                                The diagram should use ${orientation} orientation.`,
            });
            const generated = response.text || code;

            const cleanCode = generated.replace(/```(?:mermaid)?\n?|\n?```/g, '').trim();
            const codeWithOrientation = cleanCode.replace(/graph (TD|LR|BT|RL)/, `graph ${orientation}`);
            setCode(codeWithOrientation);

            // Update history
            const newHistory = history.slice(0, historyIndex + 1); // Access current historyIndex from props or state? passed as prop
            // Note: historyIndex needs to be passed in correctly.
            // Actually, setHistory updates it. We need access to historyIndex.

            // Wait, we need the latest historyIndex.
            // Best to let the main hook handle history updates or pass the current index.
            // Let's assume passed in refs or state.

            newHistory.push(codeWithOrientation);
            setHistory(newHistory);
            // setHistoryIndex is usually history.length - 1 after push.
            // But we can't see the updated state immediately. 
            // setHistoryIndex(newHistory.length - 1); // Pass a callback or handle in composed hook.
            setHistoryIndex(prev => prev + 1); // Optimistic 

            await resetView(codeWithOrientation);
        } catch (error) {
            console.error('Error updating diagram:', error);
            showToast?.("Failed to update diagram", "error");
        } finally {
            setIsLoading(false);
            isProcessingRef.current = false;
        }
    };

    const analyzeDiagram = async (isProcessingRef) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        try {
            setIsAnalyzing(true);
            const apiKey = useApiKey1 ? import.meta.env.VITE_GEMINI_API_KEY1 : import.meta.env.VITE_GEMINI_API_KEY2;

            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze this Mermaid diagram: ${code}
                       Format the response starting directly with:

                       1. Overview:
                       A brief summary of the diagram's purpose and what it represents.

                       2. Key Components:
                       List and describe the main elements and nodes in the diagram.

                       3. Flow Description:
                       Explain the relationships and flow between components, detailing how the process unfolds.

                       4. Purpose:
                       Describe the main purpose and use case of this diagram, and how it can be applied in real-world scenarios.`,
            });
            setExplanation(response.text || "");

        } catch (error) {
            console.error('Error:', error);
            showToast?.("Failed to analyze diagram", "error");
        } finally {
            setIsAnalyzing(false);
            isProcessingRef.current = false;
        }
    };

    return {
        isLoading,
        setIsLoading,
        isAnalyzing,
        setIsAnalyzing,
        explanation,
        setExplanation,
        generateDiagram,
        updateDiagram,
        analyzeDiagram
    };
};
