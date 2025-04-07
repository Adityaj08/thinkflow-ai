export const ExplanationSection = ({ isDarkMode, explanation, isAnalyzing }) => {
  if (!explanation && !isAnalyzing) return null;

  return (
    <div className={`mt-6 rounded-lg transition-all duration-200 ${
      isDarkMode 
        ? 'bg-white/10 backdrop-blur-lg border border-white/10' 
        : 'bg-white/80 backdrop-blur-lg border border-gray-200'
    }`}>
      <div className="p-6">
        <h2 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Diagram Analysis
        </h2>
        {isAnalyzing ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300/20 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300/20 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {explanation.split('\n').map((line, index) => {
              // Section headers (e.g., "1. Overview:")
              if (line.match(/^\d+\./)) {
                return (
                  <h3 key={index} className={`font-bold text-xl mt-6 ${
                    isDarkMode ? 'text-white/90' : 'text-gray-800'
                  }`}>
                    {line}
                  </h3>
                );
              }
              // Bullet points with bolded components
              else if (line.trim().startsWith('*')) {
                // Remove asterisks from the text
                const cleanedLine = line.replace(/\*\*/g, '').trim();
                
                return (
                  <div key={index} className="ml-8">
                    <p className={`flex items-start ${
                      isDarkMode ? 'text-white/80' : 'text-gray-700'
                    }`}>
                      <span className="mr-2">•</span>
                      <span className="text-lg">
                        {cleanedLine.replace('*', '').trim().split(':').map((part, i) => {
                          if (i === 0 && cleanedLine.includes(':')) {
                            return (
                              <strong key={i} className={
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }>
                                {part}:
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </span>
                    </p>
                  </div>
                );
              }
              // Regular paragraphs
              else if (line.trim()) {
                // Also remove asterisks from regular paragraphs
                const cleanedLine = line.replace(/\*\*/g, '');
                
                return (
                  <p key={index} className={`text-lg ${
                    isDarkMode ? 'text-white/80' : 'text-gray-700'
                  }`}>
                    {cleanedLine}
                  </p>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 