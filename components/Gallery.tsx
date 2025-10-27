import React, { useState } from 'react';
import { galleryData } from '../data/gallery';
import type { GalleryItem } from '../types';
import PixelArt from './PixelArt';

interface GalleryProps {
    unlockedIds: Set<string>;
    onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ unlockedIds, onBack }) => {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    const allItems = Object.values(galleryData);

    if (selectedItem) {
        return (
             <div className="p-4 flex flex-col items-center">
                <h2 className="text-3xl text-center mb-4 text-amber-400/70 tracking-widest">{selectedItem.title}</h2>
                 <div className="p-4 border-2 border-amber-400/50 bg-black/50">
                    <PixelArt 
                        pixelMap={selectedItem.pixelMap}
                        colorMap={selectedItem.colorMap}
                        pixelSize={12}
                    />
                 </div>
                <button
                    onClick={() => setSelectedItem(null)}
                    className="p-3 mt-8 text-lg text-left text-amber-400 border border-amber-400/50 bg-black/50 hover:bg-amber-400/10 hover:text-white hover:border-amber-400 hover:scale-[1.02] origin-center transition-all duration-200 w-full max-w-xs"
                >
                    > [ Back to Gallery ]
                </button>
            </div>
        )
    }

    return (
        <div className="text-center p-4 flex flex-col items-center">
            <h2 className="text-3xl text-amber-400/70 mb-4 tracking-widest">SIGNAL FRAGMENTS</h2>
            <div className="w-full max-w-2xl my-4 h-96 overflow-y-auto gallery-grid p-2">
               {allItems.map(item => {
                   const isUnlocked = unlockedIds.has(item.id);
                   return (
                       <div key={item.id} className="gallery-item" onClick={() => isUnlocked && setSelectedItem(item)}>
                           {isUnlocked ? (
                               <PixelArt 
                                    pixelMap={item.pixelMap}
                                    colorMap={item.colorMap}
                                    pixelSize={6}
                               />
                           ) : (
                               <span className="gallery-item-locked">?</span>
                           )}
                       </div>
                   )
               })}
            </div>
            <button
                onClick={onBack}
                className="p-3 mt-4 text-2xl text-left text-amber-400 border border-amber-400/50 bg-black/50 hover:bg-amber-400/10 hover:text-white hover:border-amber-400 hover:scale-[1.02] origin-center transition-all duration-200 w-full max-w-xs"
            >
                > [ Return to Menu ]
            </button>
        </div>
    );
};

export default Gallery;