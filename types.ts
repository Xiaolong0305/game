export type GameState = 'MENU' | 'PLAYING' | 'GALLERY' | 'CODEX';

export interface Item {
  name: string;
  description: string;
  isCrucial?: boolean;
}

export interface PlayerState {
    sanity: number;
    inventory: Item[];
    echoState: string;
    unlockedCodexIds: Set<string>;
    unlockedGalleryIds: Set<string>;
    dread: number;
    powerRestored: boolean;
}

export interface Choice {
  id?: string;
  text: string;
  destinationId: string;
  action?: (updateFns: UpdateFunctions) => void;
  requiredItem?: string;
  requiredState?: (playerState: PlayerState) => boolean;
  isCyclicalChoice?: boolean;
  soundEffectId?: string;
}

export interface Scene {
  getText: (playerState: PlayerState) => string;
  choices: (playerState: PlayerState) => Choice[];
  echoText?: (playerState: PlayerState) => string;
  onEnterSound?: string;
}

export type GameData = Record<string, Scene>;

export interface UpdateFunctions {
    updateSanity: (amount: number) => void;
    addItem: (itemName: string) => void;
    removeItem: (itemName: string) => void;
    incrementCyclicalCounter: () => void;
    updateEchoState: (newState: string) => void;
    unlockCodex: (id: string) => void;
    unlockGalleryImage: (id: string) => void;
    flashImage: (galleryId: string) => void;
    updateDread: (amount: number) => void;
    setPower: (state: boolean) => void;
    resetGame: () => void;
}

// --- Codex & Gallery ---
export interface CodexEntry {
    id: string;
    title: string;
    content: string;
}

export interface GalleryItem {
    id: string;
    title: string;
    pixelMap: string[];
    colorMap: Record<string, string>;
}