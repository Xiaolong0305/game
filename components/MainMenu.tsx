import React from 'react';
import type { GameState } from '../types';

interface MainMenuProps {
    onStart: () => void;
    onNavigate: (state: GameState) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onNavigate }) => {
    const MenuButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
         <button
            onClick={onClick}
            className="p-3 mt-4 text-2xl text-left text-amber-400 border border-amber-400/50 bg-black/50 hover:bg-amber-400/10 hover:text-white hover:border-amber-400 hover:scale-[1.02] origin-center transition-all duration-200 w-full max-w-xs"
        >
            {children}
        </button>
    );

    return (
        <div className="text-center p-8 flex flex-col items-center">
            <h2 className="text-2xl text-amber-400/70 -mt-2 mb-4 tracking-widest">ECHOES FROM THE ETHER</h2>
            <p className="text-xl mb-8 max-w-prose">A signal cuts through the static. A lighthouse, dark for 50 years, is calling.</p>
            
            <MenuButton onClick={onStart}>&gt; Begin Transmission</MenuButton>
            <MenuButton onClick={() => onNavigate('GALLERY')}>&gt; View Signal Fragments</MenuButton>
            <MenuButton onClick={() => onNavigate('CODEX')}>&gt; Access Codex</MenuButton>
        </div>
    );
};

export default MainMenu;