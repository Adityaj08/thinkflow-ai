import React from 'react';

export const RecoveryPrompt = ({
    isOpen,
    onRecover,
    onDismiss,
    recoveryData,
    isDarkMode
}) => {
    if (!isOpen) return null;

    const timestamp = recoveryData?.timestamp
        ? new Date(recoveryData.timestamp).toLocaleString()
        : 'Unknown';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onDismiss}
            />

            {/* Modal */}
            <div className={`relative max-w-md w-full rounded-2xl p-6 shadow-2xl ${isDarkMode
                    ? 'bg-gray-900 border border-white/10'
                    : 'bg-white border border-gray-200'
                }`}>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                        }`}>
                        <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className={`text-lg font-semibold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    Recover Unsaved Changes?
                </h3>

                {/* Description */}
                <p className={`text-center text-sm mb-4 ${isDarkMode ? 'text-white/60' : 'text-gray-500'
                    }`}>
                    We found an auto-saved diagram from <br />
                    <span className="font-medium">{timestamp}</span>
                </p>

                {/* Preview */}
                <div className={`rounded-lg p-3 mb-6 font-mono text-xs overflow-hidden ${isDarkMode ? 'bg-black/40' : 'bg-gray-100'
                    }`}>
                    <div className={`truncate ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        {recoveryData?.code?.substring(0, 100)}...
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onDismiss}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${isDarkMode
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Discard
                    </button>
                    <button
                        onClick={onRecover}
                        className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
                    >
                        Recover
                    </button>
                </div>
            </div>
        </div>
    );
};
