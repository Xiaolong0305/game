import React, { useState } from 'react';
import { codexData } from '../data/codex';
import type { CodexEntry } from '../types';

interface CodexProps {
    unlockedIds: Set<string>;
    onBack: () => void;
}

const Codex: React.FC<CodexProps> = ({ unlockedIds, onBack }) => {
    const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
    
    const unlockedEntries = Object.values(codexData).filter(entry => unlockedIds.has(entry.id));

    if (selectedEntry) {
        return (
            <div className="p-4 flex flex-col items-stretch">
                <h2 className="text-3xl text-center mb-4 text-amber-400/70 tracking-widest">{selectedEntry.title}</h2>
                <div className="w-full p-4 my-4 h-72 overflow-y-auto text-xl leading-relaxed border border-amber-400/30 bg-black/30">
                     <p className="text-amber-400/80 whitespace-pre-wrap">{selectedEntry.content}</p>
                </div>
                <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-3 mt-2 text-lg text-left text-amber-400 border border-amber-400/50 bg-black/50 hover:bg-amber-400/10 hover:text-white transition-colors duration-200"
                >
                    > [ Back to Codex ]
                </button>
            </div>
        );
    }
    
    return (
        <div className="text-center p-4 flex flex-col items-center">
            <h2 className="text-3xl text-amber-400/70 mb-4 tracking-widest">CODEX</h2>
            <div className="w-full max-w-2xl my-4 h-96 overflow-y-auto codex-list">
                {unlockedEntries.length > 0 ? (
                    unlockedEntries.map(entry => (
                        <button key={entry.id} onClick={() => setSelectedEntry(entry)} className="codex-list-item text-left">
                           > {entry.title}
                        </button>
                    ))
                ) : (
                     <p className="text-amber-400/60">No entries unlocked yet.</p>
                )}
            </div>
            <button
                onClick={onBack}
                className="p-3 mt-4 text-2xl text-left text-amber-400 border border-amber-400/50 bg-black/50 hover:bg-amber-400/10 hover:text-white transition-colors duration-200 w-full max-w-xs"
            >
                > [ Return to Menu ]
            </button>
        </div>
    );
};

export default Codex;