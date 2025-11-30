import React, { useEffect, useRef } from 'react';
import SlideUp from './animations/SlideUp';

export const EditInputBox = ({
    isOpen,
    onClose,
    onSubmit,
    value,
    setValue,
    isLoading,
    isDarkMode
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(value);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-50 w-full max-w-2xl px-4">
                <SlideUp distance={5} direction="vertical" delay={0} config={{ tension: 400, friction: 20 }}>
                    <div className={`
            w-full rounded-xl shadow-2xl overflow-hidden
            ${isDarkMode ? 'bg-black opacity-90 backdrop-blur-sm border border-white/50' : 'bg-white opacity-90 backdrop-blur-sm border border-gray-200'}
          `}>
                        <div className="p-4">
                            <textarea
                                ref={inputRef}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe Edits"
                                className={'w-full h-24 p-4 text-lg resize-none outline-none rounded-lg '}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </SlideUp>
            </div>
        </div>
    );
};
