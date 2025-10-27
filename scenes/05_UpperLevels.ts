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

export const upperLevelScenes: GameData = {
    lanternRoomStairs: {
        getText: ({sanity}) => {
            if (sanity > 40) return "The climb is long and dizzying. With each step, the air grows colder, and a strange, low hum becomes audible, vibrating through the metal of the stairs.";
            return "The stairs writhe before me, each step a new ordeal. The humming is inside my skull now, a physical presence. The shadows in the stairwell twist into humanoid shapes, reaching for me as I ascend. I feel like I'm climbing into the gullet of some great beast.";
        },
        choices: () => [
            { text: "Press on to the top.", destinationId: 'lanternRoom', action: ud(10) },
            { text: "I can't do this. Go back down.", destinationId: 'mainFloor' }
        ]
    },
    lanternRoom: {
        getText: ({ sanity, powerRestored }) => {
            let text = "I finally reach the top of the lighthouse. The massive lens and lamp assembly stand silent in the center of the room. The glass is cracked, and the bulb is shattered. ";
            if (powerRestored) text += "The restored power makes the auxiliary equipment hum, and a faint emergency light illuminates the space. ";
            else text += "The only light is my flashlight, which seems to be swallowed by the oppressive darkness. ";

            text += "On a workbench, my flashlight picks out a complex piece of equipment - it looks like a Signal Booster for a radio. A heavy access door, labeled 'CATWALK', is set in the outer wall.";
            return text;
        },
        choices: ({ inventory, powerRestored }) => [
            ...(!inventory.some(i => i.name === 'Signal Booster') ? [{ text: "Take the Signal Booster.", destinationId: 'lanternRoom', action: combine(ai('Signal Booster'), uc('item_booster')) }] : []),
            { text: "Repair the lamp with the Signal Booster.", destinationId: 'endingEscape', requiredItem: 'Signal Booster', requiredState: (s) => s.powerRestored },
            { text: "Repair the lamp (No Power).", destinationId: 'repairFailNoPower', requiredItem: 'Signal Booster', requiredState: (s) => !s.powerRestored },
            { id: 'lookInLens', text: "Look into the cracked lens.", destinationId: 'endingCyclical', action: combine(cc(), ug('watcher'), ud(10)), isCyclicalChoice: true },
            { text: "Destroy what's left of the lamp.", destinationId: 'lanternSmash', action: combine(ds(-30), ud(30), ug('not_human')), requiredItem: 'Crowbar' },
            { text: "Venture out onto the exterior catwalk.", destinationId: 'catwalk' },
            { text: "Broadcast a signal using the radio and Signal Booster.", destinationId: 'endingBroadcast', requiredItem: 'Signal Booster', requiredState: (s) => s.powerRestored},
        ],
    },
    repairFailNoPower: {
        getText: () => "I connect the Signal Booster, but without main power from the generator, it's useless. The lamp remains dark and cold. It was a foolish hope.",
        choices: () => [
            { text: "I need to get the generator working first.", destinationId: 'lanternRoom' },
        ],
    },
    lanternSmash: {
        getText: () => "A wave of terror and instinct washes over me. I raise the crowbar and bring it down on the lamp assembly. Glass explodes. The humming stops. A profound, absolute silence descends. And then, a low chuckle echoes in the darkness, seemingly from right behind me. I don't dare turn around.",
        choices: () => [
            { text: "It's inside my head now. It's me.", destinationId: 'endingMadness', soundEffectId: 'event-sound' }
        ]
    },
    lookInLensNormal: {
        getText: ({ sanity }) => {
            if (sanity > 50) return "I peer through the cracks. All I can see is the swirling snow of the blizzard outside, distorted by the thick, imperfect glass. A feeling of disappointment washes over me.";
            return "I press my eye to a crack in the lens. The blizzard outside seems to twist into unsettling patterns. For a moment, I think I see a face in the snow, vast and screaming. I pull back, shivering, my heart pounding in my chest.";
        },
        choices: () => [
            { text: "Step back from the lens. This is a bad idea.", destinationId: 'lanternRoom', action: combine(ds(-5), ud(5)) },
        ],
    },
    catwalk: {
        getText: () => "I force the heavy door open and am immediately hit by a wall of wind and ice. The narrow catwalk that rings the lantern room is treacherous, covered in a layer of slick ice. The churning, black sea is a hundred feet below. The roar of the blizzard is all-encompassing.",
        choices: () => [
            { text: "Hold the railing and carefully circle the lantern.", destinationId: 'catwalkCircle' },
            { text: "This is insane. Go back inside.", destinationId: 'lanternRoom' }
        ],
        onEnterSound: 'wave-crash'
    },
    catwalkCircle: {
        getText: ({sanity}) => {
            if(sanity > 50) return "My knuckles are white as I grip the frozen railing. Each step is a calculated risk. As I round the far side, I see it: a small, human-shaped depression in the ice and snow, as if someone was lying here, looking out at the sea. There's nothing else here. I should go back.";
            return "The wind screams like a banshee, trying to tear me from my perch. The sea below seems to be calling to me, a hypnotic, beautiful invitation to oblivion. I see the depression in the snow, and for a terrifying moment, I have the overwhelming urge to lie down in it, to become one with the storm.";
        },
        choices: () => [
            { text: "Go back inside, carefully.", destinationId: 'lanternRoom' },
            { text: "Let go.", destinationId: 'endingDrowned', action: ds(-100) },
        ]
    }
};
