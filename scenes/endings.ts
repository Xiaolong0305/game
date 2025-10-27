import type { GameData, UpdateFunctions } from '../types';

const rg = () => (utils: UpdateFunctions) => utils.resetGame();

export const endingScenes: GameData = {
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
