import React, { useState } from 'react';
import type { Item } from '../types';

interface PlayerStatsProps {
    sanity: number;
    dread: number;
    inventory: Item[];
    lastAddedItem: string | null;
    className?: string;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ sanity, dread, inventory, lastAddedItem, className }) => {
    const [inspectedItem, setInspectedItem] = useState<Item | null>(null);

    const handleItemClick = (item: Item) => {
        if (inspectedItem?.name === item.name) {
            setInspectedItem(null);
        } else {
            setInspectedItem(item);
        }
    };

    const getDreadLevelText = () => {
        if (dread <= 10) return "Minimal";
        if (dread <= 30) return "Unsettling";
        if (dread <= 60) return "Pervasive";
        if (dread <= 90) return "Crushing";
        return "Overwhelming";
    };

    const dreadTextColor = dread > 60 ? 'text-red-500 animate-pulse' : 'text-amber-400';

    return (
        <div id="player-stats" className={`w-full max-w-4xl text-lg transition-all duration-300 ${className || ''}`}>
            <div className="p-4 border border-amber-400/30 bg-black/30 text-amber-400">
                <p><span className="text-amber-400/70">SANITY:</span> {sanity}%</p>
                <p><span className="text-amber-400/70">DREAD LEVEL:</span> <span className={dreadTextColor}>{getDreadLevelText()}</span></p>
                <div>
                    <span className="text-amber-400/70">INVENTORY: </span>
                    {inventory.length > 0 ? inventory.map((item, index) => (
                        <React.Fragment key={item.name}>
                            <button
                              onClick={() => handleItemClick(item)}
                              className={`underline decoration-dotted hover:text-white transition-colors duration-150 
                                ${item.name === lastAddedItem ? 'item-added-highlight' : ''}
                                ${item.isCrucial ? 'crucial-item-highlight font-bold' : ''}
                              `}
                            >
                                {item.name}
                            </button>
                            {index < inventory.length - 1 ? ', ' : ''}
                        </React.Fragment>
                    )) : 'Empty'}
                </div>
            </div>
            {inspectedItem && (
                <div className="p-4 mt-2 border border-amber-400/30 bg-black/50 animate-[fadeIn_0.5s_ease-out]">
                    <h3 className="text-xl mb-1 underline text-amber-200">{inspectedItem.name}</h3>
                    <p className="text-amber-400/80">{inspectedItem.description}</p>
                </div>
            )}
        </div>
    );
};

export default PlayerStats;