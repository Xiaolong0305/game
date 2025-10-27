import React, { useMemo } from 'react';

interface PixelArtProps {
    pixelMap: string[];
    colorMap: Record<string, string>;
    pixelSize: number;
    className?: string;
    style?: React.CSSProperties;
}

const PixelArt: React.FC<PixelArtProps> = ({ pixelMap, colorMap, pixelSize, className, style }) => {
    const boxShadow = useMemo(() => {
        const shadows: string[] = [];
        pixelMap.forEach((row, y) => {
            row.split('').forEach((char, x) => {
                const color = colorMap[char];
                if (color && color !== 'transparent') {
                    shadows.push(`${x * pixelSize}px ${y * pixelSize}px 0 0 ${color}`);
                }
            });
        });
        return shadows.join(', ');
    }, [pixelMap, colorMap, pixelSize]);

    const artStyle: React.CSSProperties = {
        boxShadow,
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        ...style,
    };

    return <div className={className} style={artStyle}></div>;
};

export default PixelArt;
