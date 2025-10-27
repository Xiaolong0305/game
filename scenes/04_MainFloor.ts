import type { GameData, UpdateFunctions } from '../types';

// Action creators
const ds = (amount: number) => (utils: UpdateFunctions) => utils.updateSanity(amount);
const ud = (amount: number) => (utils: UpdateFunctions) => utils.updateDread(amount);
const ai = (itemName: string) => (utils: UpdateFunctions) => utils.addItem(itemName);
const cc = () => (utils: UpdateFunctions) => utils.incrementCyclicalCounter();
const ug = (id: string) => (utils: UpdateFunctions) => utils.unlockGalleryImage(id);
const uc = (id: string) => (utils: UpdateFunctions) => utils.unlockCodex(id);
const combine = (...actions: ((utils: UpdateFunctions) => void)[]) => (utils: UpdateFunctions) => {
    actions.forEach(action => action(utils));
};

export const mainFloorScenes: GameData = {
    mainFloor: {
        getText: ({ sanity, powerRestored, dread }) => {
            if (powerRestored) {
                return "I climb a short ladder into the main living quarters. The emergency lights are on, casting a sterile, buzzing glow. The spiral staircase seems more solid now, less threatening. The rhythmic tapping I heard before is gone, replaced by the hum of electricity. There's a door here I didn't see in the dark, labeled 'Keeper's Quarters'.";
            }
            if (sanity > 70) return "I climb a short ladder into what must have been the main living quarters. It's sparse and functional. A spiral staircase dominates the center of the room, leading up into the gloom. The air is cold and still.";
            if (sanity > 40) return `I emerge onto the main floor. My eyes are drawn to a strange pattern carved into the floorboards, a spiral that seems to pull me towards the staircase. I think I hear a faint, rhythmic tapping from above. Is it in my head? The dread level is ${dread}.`;
            return "The main floor feels wrong. The architecture is non-Euclidean, the angles sharp and unnatural, making me dizzy. The staircase in the center seems to twist into infinity. The tapping from above is louder now. It sounds like a fingernail on a coffin lid. My coffin.";
        },
        choices: ({powerRestored}) => [
            { text: "I have to go up. I'll take the spiral staircase.", destinationId: 'lanternRoomStairs', action: ds(-5) },
            { text: "Listen to the walls, try to pinpoint the sound.", destinationId: 'mainFloor', action: combine(ds(-15), ud(10), cc(), ug('angles')), isCyclicalChoice: true },
            { text: "Investigate the Keeper's Quarters.", destinationId: 'keepersQuarters', requiredState: () => powerRestored },
            { text: "I need to go back down. To the storage room.", destinationId: 'storageRoom' },
        ],
    },
    keepersQuarters: {
        getText: () => "The door creaks open into a small, spartan room. A single bunk, a desk, and an empty locker. It smells of ozone and despair. On the desk, under a thick layer of dust, is a single, hastily scrawled note.",
        choices: ({inventory}) => [
            ...(!inventory.some(i => i.name === 'Keeper\'s Note') ? [{ text: "Read the note.", destinationId: 'keepersQuarters', action: combine(ai('Keeper\'s Note'), uc('item_keepers_note')) }] : []),
            { text: "There's nothing else here. Return to the main floor.", destinationId: 'mainFloor' },
        ],
        onEnterSound: 'creak-sound',
    }
};
