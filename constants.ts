import { items } from './data/items';
import type { PlayerState } from './types';

export const getInitialPlayerState = (): PlayerState => ({
    sanity: 100,
    inventory: [items['Weak Radio']],
    echoState: 'dormant',
    unlockedCodexIds: new Set(['item_radio']),
    unlockedGalleryIds: new Set(),
    dread: 0,
    powerRestored: false,
});
