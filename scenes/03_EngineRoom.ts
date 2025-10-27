import type { GameData, UpdateFunctions } from '../types';

// Action creators
const ds = (amount: number) => (utils: UpdateFunctions) => utils.updateSanity(amount);
const ud = (amount: number) => (utils: UpdateFunctions) => utils.updateDread(amount);
const ai = (itemName: string) => (utils: UpdateFunctions) => utils.addItem(itemName);
const ri = (itemName: string) => (utils: UpdateFunctions) => utils.removeItem(itemName);
const uc = (id: string) => (utils: UpdateFunctions) => utils.unlockCodex(id);
const ug = (id: string) => (utils: UpdateFunctions) => utils.unlockGalleryImage(id);
const sp = (state: boolean) => (utils: UpdateFunctions) => utils.setPower(state);
const combine = (...actions: ((utils: UpdateFunctions) => void)[]) => (utils: UpdateFunctions) => {
    actions.forEach(action => action(utils));
};

export const engineRoomScenes: GameData = {
    engineRoomEntry: {
        getText: ({inventory}) => {
            let text = "The corridor ends in a flooded chamber. A massive, silent diesel generator sits in the center, half-submerged in murky water. A narrow catwalk rings the room. The air is cold and dead. ";
            if (!inventory.some(i => i.name === 'Generator Key')) text += "On the far side of the room, a small, key-locked maintenance panel is set into the generator's housing. ";
            if (!inventory.some(i => i.name === 'Fuse')) text += "A dangling electrical cable spits sparks near the water's surface, a constant, menacing hiss. Something metallic glints from beneath the water near the generator's base.";
            return text;
        },
        choices: ({inventory}) => [
            { text: "Look for a way to drain the water.", destinationId: 'drainagePipe' },
            ...(!inventory.some(i => i.name === 'Generator Key') ? [{ text: "Wade into the water to get the glinting object.", destinationId: 'wadeForObject' }] : []),
            { text: "Examine the generator's maintenance panel.", destinationId: 'generatorPanel' },
            { text: "Return to the storage room.", destinationId: 'storageRoom' },
        ],
        onEnterSound: 'creak-sound',
    },
    drainagePipe: {
        getText: () => "I find a large drainage valve wheel, covered in rust. It looks like it hasn't been turned in decades. My hands slip on the slick metal. It's not going to budge without some serious leverage.",
        choices: () => [
            { text: "Use the crowbar to turn the valve.", destinationId: 'drainWater', requiredItem: 'Crowbar' },
            { text: "It's no use. I'll look around some more.", destinationId: 'engineRoomEntry' },
        ]
    },
    wadeForObject: {
        getText: () => "I grit my teeth and step into the freezing water. It's shockingly cold, instantly soaking through my boots. As I reach for the object—a brass key—I feel something brush against my leg. It's smooth and cold, and far too large to be a fish. I scramble back onto the walkway, my heart hammering in my chest, the key clutched in my hand.",
        choices: () => [
            { text: "I've got the key. I need to get out of the water.", destinationId: 'engineRoomEntry', action: combine(ds(-15), ud(15), ai('Generator Key'), uc('item_key')) },
        ]
    },
    drainWater: {
        getText: () => "Using the crowbar, I manage to turn the wheel with a deafening screech of protest. With a great sucking sound, the murky water begins to recede down a large drain. As the water level drops, a heavy industrial fuse is revealed, lying on the now-exposed floor.",
        choices: ({inventory}) => [
            ...(!inventory.some(i => i.name === 'Fuse') ? [{ text: "Pick up the fuse.", destinationId: 'engineRoomDrained', action: combine(ai('Fuse'), uc('item_fuse')) }] : []),
            { text: "Now I can inspect the room properly.", destinationId: 'engineRoomDrained' }
        ]
    },
    engineRoomDrained: {
        getText: () => "With the water gone, the engine room feels less menacing, but somehow larger and emptier. The generator looms like a dead god on its throne. The maintenance panel is now easily accessible.",
        choices: () => [
            { text: "Examine the generator's maintenance panel.", destinationId: 'generatorPanel' },
            { text: "Return to the storage room.", destinationId: 'storageRoom' },
        ]
    },
    generatorPanel: {
        getText: ({inventory}) => {
            if (!inventory.some(i => i.name === 'Generator Key')) return "The maintenance panel is locked. I need a key.";
            if (!inventory.some(i => i.name === 'Fuse')) return "I unlock the panel. Inside is a tangle of wires and a large, empty slot marked 'PRIMARY FUSE'. A scorched manual page is stuck to the inside of the door.";
            return "I unlock the panel. The empty fuse slot seems to be waiting. I have the fuse. I can try to restore power."
        },
        choices: ({inventory}) => [
            ...(!inventory.some(i => i.name === 'Fuse') && inventory.some(i => i.name === 'Generator Key') ? [{ text: "Read the manual page.", destinationId: 'readManual', action: uc('generator_manual') }] : []),
            { text: "Place the fuse in the slot.", destinationId: 'powerOn', requiredItem: 'Fuse' },
            { text: "I'm not ready for this. I'll leave it.", destinationId: 'engineRoomDrained', requiredState: s => s.inventory.some(i => i.name === 'Fuse')},
            { text: "I'm not ready for this. I'll leave it.", destinationId: 'engineRoomEntry', requiredState: s => !s.inventory.some(i => i.name === 'Fuse')},
        ]
    },
    readManual: {
        getText: () => "The page is brittle. It reads: 'WARNING: Do not attempt to engage primary ignition without a certified industrial-grade fuse installed. Failure to do so may result in catastrophic overload and... [The rest of the page is scorched and unreadable].'",
        choices: () => [
            { text: "Step back from the panel.", destinationId: 'generatorPanel' },
        ]
    },
    powerOn: {
        getText: () => "The fuse slides into place with a satisfying clunk. I find the ignition switch and flip it. The generator sputters, then roars to life, its vibrations shaking the very foundations of the lighthouse. Emergency lights flicker on, casting long, dancing shadows. I've restored power. But I have a terrible feeling I've just announced my presence to whatever is in this place.",
        choices: () => [
            { text: "With the power on, I should head back up.", destinationId: 'mainFloor', action: combine(sp(true), ud(20), ug('engine_heart')) }
        ]
    }
};
