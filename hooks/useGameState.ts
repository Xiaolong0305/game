import { useState, useEffect, useCallback, useMemo } from 'react';
import { gameData } from '../gameData';
import { items } from '../data/items';
import { getInitialPlayerState } from '../constants';
import type { Choice, UpdateFunctions, Item, Scene, PlayerState, GameState } from '../types';
import { playSound } from '../utils/audio';

export const useGameState = () => {
    // Game State
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [currentSceneId, setCurrentSceneId] = useState('start');

    // Player State
    const [playerState, setPlayerState] = useState<PlayerState>(getInitialPlayerState);
    const { sanity, inventory, echoState, unlockedCodexIds, unlockedGalleryIds, dread, powerRestored } = playerState;

    // Cyclical/Special State
    const [cyclicalCounter, setCyclicalCounter] = useState(0);

    // UI/FX State
    const [audioInitialized, setAudioInitialized] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);
    const [flashedImageId, setFlashedImageId] = useState<string | null>(null);
    
    const startAmbientSound = useCallback(() => {
        const sound = document.getElementById('ambient-sound') as HTMLAudioElement;
        if (sound && sound.paused) {
            sound.volume = 0.4;
            sound.play().catch(error => console.log(`Ambient audio error: ${error.message}`));
        }
    }, []);

    const resetGame = useCallback(() => {
        setPlayerState(getInitialPlayerState());
        setCurrentSceneId('start');
        setCyclicalCounter(0);
        setGameState('MENU');
    }, []);

    useEffect(() => {
        if (gameState === 'PLAYING' && sanity <= 0) {
            setCurrentSceneId('endingMadness');
        }
    }, [sanity, gameState]);
     
    useEffect(() => {
        if (gameState === 'PLAYING' && dread >= 100) {
            setCurrentSceneId('endingConsumed');
        }
    }, [dread, gameState]);

    const flashImage = useCallback((galleryId: string) => {
        setFlashedImageId(galleryId);
        setTimeout(() => setFlashedImageId(null), 350); // ms the flash effect lasts
    }, []);
    
    const updateFns: UpdateFunctions = useMemo(() => ({
        updateSanity: (amount: number) => {
            if (amount < 0) playSound('sanity-loss-sound', { volume: 0.5 });
            setPlayerState(prev => ({...prev, sanity: Math.max(0, Math.min(100, prev.sanity + amount))}));
        },
        addItem: (itemName: string) => {
            const itemToAdd = items[itemName];
            if (itemToAdd && !inventory.some(i => i.name === itemName)) {
                playSound('item-pickup-sound', { volume: 0.6 });
                setPlayerState(prev => ({...prev, inventory: [...prev.inventory, itemToAdd]}));
                setLastAddedItem(itemName);
                setTimeout(() => setLastAddedItem(null), 1500);
            }
        },
        removeItem: (itemName: string) => setPlayerState(prev => ({...prev, inventory: prev.inventory.filter(i => i.name !== itemName)})),
        incrementCyclicalCounter: () => setCyclicalCounter(prev => prev + 1),
        updateEchoState: (newState: string) => setPlayerState(prev => ({...prev, echoState: newState})),
        unlockCodex: (id: string) => {
            setPlayerState(prev => {
                if (!prev.unlockedCodexIds.has(id)) {
                    playSound('unlock-sound', { volume: 0.5 });
                    const newSet = new Set(prev.unlockedCodexIds);
                    newSet.add(id);
                    return {...prev, unlockedCodexIds: newSet};
                }
                return prev;
            });
        },
        unlockGalleryImage: (id: string) => {
            setPlayerState(prev => {
                if (!prev.unlockedGalleryIds.has(id)) {
                    if (id === 'not_human') flashImage(id);
                    else playSound('unlock-sound', { volume: 0.4 });
                    const newSet = new Set(prev.unlockedGalleryIds);
                    newSet.add(id);
                    return {...prev, unlockedGalleryIds: newSet};
                }
                return prev;
            });
        },
        updateDread: (amount: number) => {
             setPlayerState(prev => ({...prev, dread: Math.max(0, Math.min(100, prev.dread + amount))}));
        },
        setPower: (state: boolean) => {
            if (state) playSound('generator-start', { volume: 0.7 });
            setPlayerState(prev => ({...prev, powerRestored: state}));
        },
        flashImage,
        resetGame,
    }), [inventory, resetGame, flashImage]);
    
    const handleStartGame = useCallback(() => {
        playSound('click-sound');
        if (!audioInitialized) {
            startAmbientSound();
            setAudioInitialized(true);
        }
        setGameState('PLAYING');
    }, [audioInitialized, startAmbientSound]);

    const handleChoiceSelect = useCallback((choice: Choice) => {
        playSound('click-sound');
        if(choice.soundEffectId) playSound(choice.soundEffectId, { volume: 0.7 });
        
        if (choice.id === 'lookInLens' && cyclicalCounter < 2) {
            if (choice.action) choice.action(updateFns);
            setCurrentSceneId('lookInLensNormal');
            return;
        }

        if (choice.action) choice.action(updateFns);
        
        const newSceneId = choice.destinationId;
        if (newSceneId !== currentSceneId) {
            setCurrentSceneId(newSceneId);
            const newScene = gameData[newSceneId] as Scene | undefined;
            if (newScene?.onEnterSound) playSound(newScene.onEnterSound, { volume: 0.6 });
        }
    }, [cyclicalCounter, currentSceneId, updateFns]);
    
    const containerClasses = useMemo(() => {
        let classes = 'relative w-full min-h-screen p-4 flex flex-col items-center justify-center bg-black transition-all duration-1000';
        if (gameState !== 'PLAYING') return classes;

        const filterClasses = [];
        if (sanity < 70) filterClasses.push('saturate-[.85]');
        if (sanity < 50) classes += ' animate-flicker-slow';
        if (sanity < 40) {
            filterClasses.push('contrast-125');
            classes += ' animate-screen-shake';
        }
        if (sanity < 30) {
            classes += ' vignette';
            filterClasses.push('hue-rotate-[-15deg]');
        }
        if (sanity < 15) {
            classes += ' animate-static';
            filterClasses.push('saturate-[.70]');
        }
        return `${classes} ${filterClasses.join(' ')}`;
    }, [sanity, gameState]);

    const storyTextClasses = sanity < 20 && gameState === 'PLAYING' ? 'animate-border-flicker' : '';

    const currentScene = gameData[currentSceneId];
    const availableChoices = currentScene.choices(playerState).filter(choice => {
        const hasItem = !choice.requiredItem || inventory.some(i => i.name === choice.requiredItem);
        const hasState = !choice.requiredState || choice.requiredState(playerState);
        return hasItem && hasState;
    });

    return {
        gameState,
        playerState,
        currentScene,
        availableChoices,
        lastAddedItem,
        flashedImageId,
        containerClasses,
        storyTextClasses,
        handleStartGame,
        handleChoiceSelect,
        setGameState,
    };
};