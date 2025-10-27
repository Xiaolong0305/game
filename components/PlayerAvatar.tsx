import React, { useMemo } from 'react';
import PixelArt from './PixelArt';

const PlayerAvatar: React.FC<{ sanity: number }> = ({ sanity }) => {
    const pixelMap = useMemo(() => [
        "................",
        "....HHHHHHHH....",
        "...HHHHhhhhHH...",
        "..HHHhhsshhHHH..",
        "..HHhssvvsshHh..",
        "..HhssvvsshhHh..",
        "..HhsssssshhHh..",
        "...HhhhhhhhH....",
        ".GGGGGGGGGGGGGG.",
        ".GgGgGgGgGgGgGg.",
        ".GGGGGGGGGGGGGG.",
        "...GgGgGgGgGg...",
        "...GGGGGGGGGG...",
        "...GgGgGgGgGg...",
        "...GGGGGGGGGG...",
        "................",
    ], []);

    const baseColors = {
        'H': '#3d2314', // Hair dark
        'h': '#573B26', // Hair light
        's': '#f2d2b4', // Skin
        'v': '#64c8c8', // Visor
        'G': '#2a5343', // Gear dark
        'g': '#4e7a55', // Gear light
        '.': 'transparent',
    };
    
    const sanityColors = useMemo(() => {
        const newColors = {...baseColors};
        if (sanity < 70) newColors['v'] = '#a8d87d';
        if (sanity < 40) {
            newColors['s'] = '#d2b4f2';
            newColors['H'] = '#5a143b';
        }
        if (sanity < 20) newColors['G'] = '#7d1f1f';
        return newColors;
    }, [sanity]);

    const glitchPixel = (glitchChance: number) => {
        return Math.random() < glitchChance;
    }

    const glitchedPixelMap = useMemo(() => {
        if (sanity > 39) return pixelMap;
        if (sanity <= 0) return Array(16).fill("................");
        
        const glitchChance = ((40 - sanity) / 40.0) * 0.2;
        return pixelMap.map(row => 
            row.split('').map(char => glitchPixel(glitchChance) ? '.' : char).join('')
        );
    }, [sanity, pixelMap]);

    return (
        <div id="player-avatar-container">
             <PixelArt
                pixelMap={glitchedPixelMap}
                colorMap={sanityColors}
                pixelSize={3}
                className="pixel-avatar"
                style={{
                     animation: sanity < 70 && sanity > 0 ? 'flicker-fast 3s infinite' : 'none',
                }}
             />
        </div>
    );
};

export default PlayerAvatar;
