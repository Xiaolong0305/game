import type { GameData, UpdateFunctions } from '../types';

// Action creators
const ds = (amount: number) => (utils: UpdateFunctions) => utils.updateSanity(amount);
const ud = (amount: number) => (utils: UpdateFunctions) => utils.updateDread(amount);
const ai = (itemName: string) => (utils: UpdateFunctions) => utils.addItem(itemName);
const ri = (itemName: string) => (utils: UpdateFunctions) => utils.removeItem(itemName);
const ues = (state: string) => (utils: UpdateFunctions) => utils.updateEchoState(state);
const uc = (id: string) => (utils: UpdateFunctions) => utils.unlockCodex(id);
const combine = (...actions: ((utils: UpdateFunctions) => void)[]) => (utils: UpdateFunctions) => {
    actions.forEach(action => action(utils));
};

export const basementScenes: GameData = {
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
