import React from 'react';
import { useGameState } from './hooks/useGameState';

import MainMenu from './components/MainMenu';
import PlayerAvatar from './components/PlayerAvatar';
import PlayerStats from './components/PlayerStats';
import StoryView from './components/StoryView';
import Gallery from './components/Gallery';
import Codex from './components/Codex';
import PixelArt from './components/PixelArt';
import { galleryData } from './data/gallery';

const App: React.FC = () => {
    const {
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
    } = useGameState();
    
    const renderGameView = () => (
        <>
            <PlayerAvatar sanity={playerState.sanity} />
            <PlayerStats
                sanity={playerState.sanity}
                dread={playerState.dread}
                inventory={playerState.inventory}
                lastAddedItem={lastAddedItem}
            />
            <StoryView 
                scene={currentScene} 
                playerState={playerState} 
                choices={availableChoices} 
                onChoiceSelect={handleChoiceSelect}
                storyTextClasses={storyTextClasses}
            />
        </>
    );
    
    const renderContent = () => {
        switch (gameState) {
            case 'MENU':
                return <MainMenu onStart={handleStartGame} onNavigate={setGameState} />;
            case 'GALLERY':
                return <Gallery unlockedIds={playerState.unlockedGalleryIds} onBack={() => setGameState('MENU')} />;
            case 'CODEX':
                return <Codex unlockedIds={playerState.unlockedCodexIds} onBack={() => setGameState('MENU')} />;
            case 'PLAYING':
            default:
                return renderGameView();
        }
    };
    
    const flashedItem = flashedImageId ? galleryData[flashedImageId] : null;

    return (
        <main className={containerClasses}>
             {flashedItem && (
                <div className="flash-overlay">
                    <PixelArt 
                        pixelMap={flashedItem.pixelMap}
                        colorMap={flashedItem.colorMap}
                        pixelSize={16}
                    />
                </div>
            )}
            <div id="game-container" className="relative w-full max-w-4xl p-6 border-2 border-amber-400/30 bg-black/50 shadow-[0_0_15px_rgba(255,190,0,0.3)]">
                <h1 className="text-5xl text-center mb-4 text-amber-400/80 tracking-widest">THE LAST SIGNAL</h1>
                {renderContent()}
            </div>
            <footer className="text-amber-400/50 mt-4 text-sm">A Psychological Horror Experience</footer>
        </main>
    );
};

export default App;