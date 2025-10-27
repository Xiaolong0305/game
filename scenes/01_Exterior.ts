import type { GameData, UpdateFunctions } from '../types';
import { items } from '../data/items';

// Action creators
const ds = (amount: number) => (utils: UpdateFunctions) => utils.updateSanity(amount);
const ud = (amount: number) => (utils: UpdateFunctions) => utils.updateDread(amount);
const ai = (itemName: string) => (utils: UpdateFunctions) => utils.addItem(itemName);
const ug = (id: string) => (utils: UpdateFunctions) => utils.unlockGalleryImage(id);
const uc = (id: string) => (utils: UpdateFunctions) => utils.unlockCodex(id);
const combine = (...actions: ((utils: UpdateFunctions) => void)[]) => (utils: UpdateFunctions) => {
    actions.forEach(action => action(utils));
};

export const exteriorScenes: GameData = {
    start: {
        getText: () => "The blizzard howls outside my small radio outpost. It's been a quiet tour. Too quiet.\nSuddenly, a burst of static crackles through the speaker. I lean in, straining to hear. A faint, desperate voice cuts through.\n'...in the light... It's in the light... Don't let it out... Echo Rock...repeating...'",
        choices: () => [
            { text: "Stay here. Venturing into that blizzard is suicide.", destinationId: 'endingTrapped' },
            { text: "Echo Rock? That lighthouse has been dark for 50 years. I have to see what's going on.", destinationId: 'approachLighthouse', action: ug('lighthouse'), soundEffectId: 'event-sound' },
        ],
    },
    approachLighthouse: {
        getText: () => "I pull on my heaviest gear and step out into the blinding snow. The wind bites at any exposed skin, a physical assault. After a treacherous journey that feels like hours, the skeletal frame of the Echo Rock Lighthouse looms out of the blizzard. It stands dark and silent, a tombstone against the grey sky. A profound sense of dread settles in my gut.",
        choices: () => [
            { text: "This is a mistake. I should turn back before I freeze.", destinationId: 'endingFrozen' },
            { text: "Check the main entrance first.", destinationId: 'lighthouseEntrance' },
            { text: "Circle the base, look for another way in.", destinationId: 'lighthouseBase' },
        ],
    },
    lighthouseEntrance: {
        getText: () => "I stand before a heavy iron door, pitted with rust. A large, complex lock is set into it, long since seized by time and salt. There's a faint, rhythmic scratching sound coming from the other side. It stops the moment I get close.",
        choices: () => [
            { text: "It's no use. I'll go back and circle the base.", destinationId: 'lighthouseBase', action: ud(5) },
        ],
    },
    lighthouseBase: {
        getText: () => "The wind is fiercer here, screaming past the curved walls. My flashlight beam cuts through the swirling snow and falls on a rusted maintenance hatch near the foundation, barely clinging to its hinges. It looks like it could be forced. Nearby, I spot a small, weathered toolbox half-buried in a snowdrift.",
        choices: ({ inventory }) => [
            ...(!inventory.some(i => i.name === 'Crowbar') ? [{ text: "Try to pry open the hatch with my bare hands.", destinationId: 'hatchFail', action: ds(-5) }] : []),
            { text: "Use the crowbar to pry open the rusted hatch.", destinationId: 'hatchSuccess', requiredItem: 'Crowbar' },
            ...(!inventory.some(i => i.name === 'Crowbar') ? [{ text: "Inspect that toolbox.", destinationId: 'toolbox' }] : []),
            { text: "Go back to the main entrance. Maybe I missed something.", destinationId: 'lighthouseEntrance' },
        ],
    },
    toolbox: {
        getText: () => "I kick the snow away and wrench the toolbox open. Inside, among rusted, useless tools, is a sturdy crowbar. It feels heavy and solid in my gloved hands. A potential solution.",
        choices: () => [
            { text: "Take the crowbar. Now for that hatch.", destinationId: 'lighthouseBase', action: combine(ai('Crowbar'), uc('item_crowbar')) },
        ],
    },
    hatchFail: {
        getText: () => "I pull at the hatch, my fingers screaming in the cold. It doesn't budge. A sharp edge slices my glove, drawing blood. The pain is a shock, and a wave of despair washes over me. This was a stupid idea.",
        choices: () => [
            { text: "This is hopeless. I'll circle the base again.", destinationId: 'lighthouseBase' },
        ],
    },
    hatchSuccess: {
        getText: ({ sanity }) => {
            if (sanity > 60) return "With the crowbar, I have the leverage I need. A groan of tortured metal echoes in the wind, and the hatch gives way, opening into darkness. A smell of salt, damp, and something else... something sweet and rotten, wafts out, making me gag.";
            return "I jam the crowbar into the seam and heave. The shriek of metal is deafening. The hatch flies open, revealing a gaping black maw. The stench that pours out is indescribable, a cloying mix of decay and ozone. For a second, I thought I saw two pale points of light staring back at me from the abyss before they vanished.";
        },
        choices: () => [
            { text: "There's no turning back now. Descend into the darkness.", destinationId: 'storageRoom', action: ud(10) },
        ],
        onEnterSound: 'creak-sound',
    },
};
