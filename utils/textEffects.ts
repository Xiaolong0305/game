// Helper function to apply glitch effects to text at low sanity
export const applyGlitchEffects = (text: string, sanity: number): string => {
    if (sanity > 39) return text;
    if (sanity <= 0) return "REALITY IS A BROKEN TOY. THE STATIC IS ALL THAT REMAINS. ALL IS STATIC.";

    const glitchChance = (40 - sanity) / 40; // a value from 0 to 1

    const scrambleWord = (word: string) => {
        if (word.length < 3) return word;
        const chars = word.split('');
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join('');
    };

    let distortedText = text.split(' ').map(word => {
        if (Math.random() < glitchChance * 0.3) {
            return scrambleWord(word);
        }
        return word;
    }).join(' ');

    const glitchChars = ['#', '@', '!', '%', '&', '*', '_', '?', '¿', '§', '▓', '▒', '░'];
    distortedText = distortedText.split('').map(char => {
        if (char !== ' ' && Math.random() < glitchChance * 0.1) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
    }).join('');

    return distortedText;
};
