export const playSound = (id: string, options?: { volume?: number }) => {
    const sound = document.getElementById(id) as HTMLAudioElement;
    if (sound) {
        sound.currentTime = 0;
        sound.volume = options?.volume || 1.0;
        sound.play().catch(error => console.log(`Audio error for #${id}: ${error.message}`));
    }
};
