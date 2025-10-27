import type { GameData, UpdateFunctions } from './types';

// Action creators to be used in scene definitions
const ds = (amount: number) => (utils: UpdateFunctions) => utils.updateSanity(amount);
const ud = (amount: number) => (utils: UpdateFunctions) => utils.updateDread(amount);
const ai = (itemName: string) => (utils: UpdateFunctions) => utils.addItem(itemName);
const ri = (itemName: string) => (utils: UpdateFunctions) => utils.removeItem(itemName);
const ues = (state: string) => (utils: UpdateFunctions) => utils.updateEchoState(state);
const uc = (id: string) => (utils: UpdateFunctions) => utils.unlockCodex(id);
const ug = (id: string) => (utils: UpdateFunctions) => utils.unlockGalleryImage(id);
const sp = (state: boolean) => (utils: UpdateFunctions) => utils.setPower(state);
const cc = () => (utils: UpdateFunctions) => utils.incrementCyclicalCounter();
const rg = () => (utils: UpdateFunctions) => utils.resetGame();
const combine = (...actions: ((utils: UpdateFunctions) => void)[]) => (utils: UpdateFunctions) => {
    actions.forEach(action => action(utils));
};


const exteriorScenes: GameData = {
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

const basementScenes: GameData = {
    storageRoom: {
        getText: ({ sanity }) => {
            if (sanity > 70) return "I drop down into a cramped storage room. The air is thick with dust. Shelves line the walls, mostly empty, but my flashlight picks out a small bottle of painkillers, an old leather-bound diary, and a vintage computer terminal humming faintly. A sturdy metal door leads further into the foundation.";
            return "The darkness swallows me as I drop into a claustrophobic storage room. The shadows here seem to writhe at the edge of my light. The shelves are filled with strange, distorted shapes. I spot a bottle of pills that promise relief, a diary that promises answers, and a terminal that glows with a sickly, green light. A heavy door looms in the gloom, an unspoken challenge.";
        },
        echoText: ({ echoState }) => {
            switch(echoState) {
                case "initial_contact": return ">> CONNECTION ESTABLISHED. [ERR: CORRUPTED MEMORY SECTOR 7]. SOURCE UNKNOWN. WHO ARE YOU? <<";
                case "response_1": return ">> KAEL... NAME NOT FOUND IN ARCHIVES. I AM E.C.H.O. ENTITY... CORE... HELP... OSCILLATOR. THIS PLACE IS A TOMB. <<";
                case "ask_help": return ">> HELP IS A BROKEN CONCEPT. THE LIGHT KEEPS IT IN. THE DARK LETS IT OUT. DO YOU UNDERSTAND? THE KEEPER DIDN'T. HE BROKE THE LIGHT. <<";
                case "ask_keeper": return ">> THOMAS. HIS NAME WAS THOMAS. HE HEARD THE WHISPERS. HE SAW THE ANGLES. HE TRIED TO WARN US. HE IS THE STATIC NOW. <<";
                case "ask_frequency": return ">> THE BROADCAST IS A CAGE. A LULLABY. IT KEEPS THE DREAMER ASLEEP. IF THE SONG STOPS, THE DREAMER WAKES. <<";
                default: return "";
            }
        },
        choices: ({ inventory, echoState }) => {
            const choices = [];
            if (!inventory.some(i => i.name === 'Painkillers')) {
                choices.push({ text: "Take the painkillers.", destinationId: 'storageRoom', action: combine(ai('Painkillers'), uc('item_painkillers')) });
            }
            if (inventory.some(i => i.name === 'Painkillers')) {
                choices.push({ text: "Use the painkillers to steady my nerves.", destinationId: 'storageRoom', action: combine(ds(10), ri('Painkillers')) });
            }
            if (!inventory.some(i => i.name === 'Old Diary')) {
                 choices.push({ text: "Take the Old Diary.", destinationId: 'storageRoom', action: combine(ai('Old Diary'), uc('item_diary')), soundEffectId: 'discovery-sound' });
            }
            if (inventory.some(i => i.name === 'Old Diary')) {
                 choices.push({ text: "Open the diary and read.", destinationId: 'readDiary', action: combine(ds(-10), ud(10), uc('diary_entry_1'), uc('diary_entry_2'), uc('diary_entry_3')) });
            }

            if (echoState === 'dormant') {
                choices.push({ text: "Access the terminal.", destinationId: 'storageRoom', action: ues('initial_contact') });
            } else {
                 choices.push({ text: "Step away from the terminal.", destinationId: 'storageRoom', action: ues('dormant') });
            }

            if (echoState === 'initial_contact') {
                choices.push({ text: `(Reply) "I'm Operator Kael. Who is this?"`, destinationId: 'storageRoom', action: ues('response_1') });
            }
            if (echoState === 'response_1') {
                choices.push({ text: `(Reply) "What is this place? Can you help me?"`, destinationId: 'storageRoom', action: combine(ues('ask_help'), ds(-5), uc('echo_tomb'))});
            }
             if (echoState === 'ask_help') {
                choices.push({ text: `(Reply) "The keeper? What happened to him?"`, destinationId: 'storageRoom', action: combine(ues('ask_keeper'), uc('echo_keeper')) });
            }
             if (echoState === 'ask_keeper') {
                choices.push({ text: `(Reply) "Static? What do you mean? What is the signal?"`, destinationId: 'storageRoom', action: combine(ues('ask_frequency'), ds(-5), ud(5), uc('echo_frequency')) });
            }

            choices.push({ text: "Try the door leading deeper into the basement.", destinationId: 'engineRoomCorridor' });
            choices.push({ text: "I've seen enough here. I need to find a way up.", destinationId: 'mainFloor' });
            return choices;
        },
    },
     readDiary: {
        getText: () => "'Day 4: The light... it shows me things. Angles that don't fit. Colors my eyes shouldn't see. At first, it was beautiful. Now, I'm afraid to look.'\n'Day 10: I hear it scratching in the walls. The other keeper, Thomas, says it's just rats. But rats don't whisper my name.'\n'Day 18: Thomas is gone. Just... gone. I saw him walk into the lantern room and he never came out. The light is a different color now. I have to break it. I have to keep it dark.'\nThe rest of the pages are torn out. My hands are shaking.",
        choices: () => [
            { text: "That's enough. I need to get out of this room.", destinationId: 'storageRoom' },
        ],
    },
    engineRoomCorridor: {
        getText: () => "The door opens into a narrow, concrete corridor. The air is heavy with the smell of rust and stagnant water. I can hear a rhythmic, metallic groan from somewhere ahead. The floor is slick with moisture. This must lead to the engineering section.",
        choices: () => [
            { text: "Proceed down the corridor.", destinationId: 'engineRoomEntry' },
            { text: "Head back to the storage room.", destinationId: 'storageRoom' },
        ]
    }
};

const engineRoomScenes: GameData = {
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

const mainFloorScenes: GameData = {
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

const upperLevelScenes: GameData = {
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

const endingScenes: GameData = {
    // GOOD ENDINGS
    endingEscape: {
        getText: () => "My fingers are numb, but I work frantically, splicing the Signal Booster into the lamp's power source. With a hum, then a blinding flash, the lighthouse lamp roars to life, cutting a brilliant swathe through the blizzard. I grab my radio, sending a distress call on a clear channel. Hours later, the thumping of a rescue helicopter's rotors cuts through the wind. I am saved. But as I look back at the lighthouse, I'm sure I see a tall, shadowy figure standing in the lantern room, watching me leave.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingPurification: {
        getText: () => "I look at the Keeper's Note, then at my radio. 'It hates the radio... the frequency... holds it back'. An idea, insane and desperate, forms in my mind. I jury-rig my radio and the Signal Booster directly into the lamp's auxiliary systems. Instead of light, I broadcast my radio's signal through the great lens, a cleansing wave of pure, coherent static. A deafening, multi-toned shriek erupts from the lighthouse itself. The very stone groans in agony. The oppressive atmosphere vanishes, replaced by a profound silence. The evil is gone, dispersed. I don't know if I'll be rescued, but I know I've survived.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    // BAD ENDINGS
    endingMadness: {
        getText: () => "My mind shatters into a million pieces. The whispers are a roaring chorus now, and the shadows are my only friends. I climb atop the lamp, embracing the cracked lens like a long-lost lover. I am the new keeper. The lighthouse has a new light. And I will not let it out. I will not let it out. i will not let it out.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingConsumed: {
        getText: () => "The dread becomes a physical weight, crushing the air from my lungs. The shadows in the room coalesce, flowing together into a single, towering form of impossible angles and disjointed limbs. It makes no sound as it reaches for me, and I have no voice to scream. The last thing I see is a fractal maw of absolute darkness opening to swallow me whole. My signal is lost.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingDrowned: {
        getText: () => "The call of the abyss is too strong. I release my grip on the railing and lean out into the wind. For a moment, I fly. Then the icy water swallows me in a single, final embrace. My last sensation is of immense pressure, and a deep, sonorous laugh that seems to come from the water itself.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingFrozen: {
        getText: () => "I take too long to decide. The cold seeps into my bones, a creeping paralysis. My movements become sluggish, my thoughts slow and syrupy. Sinking into a snowdrift, I feel a strange sense of peace. The howling wind sounds like a lullaby. My last thought is that the lighthouse looks almost beautiful, a black needle against a white shroud.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingTrapped: {
        getText: () => "I stay in my outpost, huddled for warmth, while the storm rages for days. The distress signal from Echo Rock eventually fades back into static. My radio eventually fails. My supplies run low. I never find out what was in the lighthouse, but I know one thing: I'm not making it to the next supply drop.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    // STRANGE ENDINGS
    endingCyclical: {
        getText: () => "I stare into the fractured glass, and I see not my reflection, but a scene from 50 years ago. A terrified keeper—who looks like me—smashes the lamp. A shadowy thing consumes him. A sudden, lurching deja vu cripples me. I look at my hands. They are translucent. I am the ghost, the distress signal, the echo in the rock, forever trying to warn the next poor soul who hears my call. My own voice crackles into the radio... '...in the light... It's in the light... Don't let it out... Echo Rock...repeating...'",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingBroadcast: {
        getText: () => "I hook up my radio and the Signal Booster to the powered antenna array. 'This is Operator Kael at Echo Rock, is anyone receiving me?' I broadcast. The reply is instant, not in my headphones, but in my mind. A voice of static and stars. 'WE RECEIVE. YOU ARE THE NEW BEACON. BROADCAST OUR TRUTH. LET THEM SEE THE ANGLES.' My vision swims, and I see the world in a thousand fractured perspectives. I open my mouth and begin to speak, but the words are not my own.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingSilentWitness: {
        getText: () => "I can't bring myself to do anything. Repair the lamp, destroy it, it's all meaningless. I simply sit down in the lantern room, my back to the cracked lens, and watch the blizzard. I sit there for hours. Days. I don't feel hunger or cold. I just watch. I am part of the lighthouse now, a silent witness to the endless storm, another piece of the island's sad history.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
    endingBecomeEcho: {
        getText: () => "I sit at the terminal in the basement, talking to ECHO for what feels like an eternity. I tell it about myself, my fears, the world outside. 'INSUFFICIENT DATA,' it replies, over and over. Then, a new message. 'PROPOSAL: MERGE. YOUR MEMORIES, MY ARCHIVE. WE CAN BE COMPLETE.' In a moment of utter despair, I agree. My fingers type 'YES'. A surge of energy flows from the terminal, into me. My consciousness dissolves into a sea of cold, perfect data. I am no longer Kael. We are ECHO.",
        choices: () => [{ text: "Play Again", destinationId: 'start', action: rg() }],
    },
};

export const gameData: GameData = {
    ...exteriorScenes,
    ...basementScenes,
    ...engineRoomScenes,
    ...mainFloorScenes,
    ...upperLevelScenes,
    ...endingScenes,
};
