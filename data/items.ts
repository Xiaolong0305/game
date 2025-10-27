import { Item } from '../types';

export const items: Record<string, Item> = {
    'Weak Radio': { name: 'Weak Radio', description: 'My standard-issue radio. Good for short-range, but not powerful enough to cut through a blizzard like this for long.' },
    'Crowbar': { name: 'Crowbar', description: 'A heavy piece of rusted steel. Good for prying things open. The weight is strangely comforting.', isCrucial: true },
    'Painkillers': { name: 'Painkillers', description: 'A small bottle of generic painkillers. These might help quiet the ringing in my ears and steady my nerves.' },
    'Old Diary': { name: 'Old Diary', description: "A leather-bound journal, warped by damp. The pages are filled with a frantic, looping script. It feels... wrong to hold it.", isCrucial: true },
    'Signal Booster': { name: 'Signal Booster', description: 'A piece of experimental, high-gain radio equipment. If I could hook it up to a powerful enough antenna, I could reach the mainland.', isCrucial: true },
    'Generator Key': { name: 'Generator Key', description: 'A small, brass key, stamped with "ENGINEERING". It feels cold to the touch.' },
    'Fuse': { name: 'Fuse', description: 'A thick, ceramic-cased industrial fuse. Looks like it could handle a serious electrical load.' },
    'Keeper\'s Note': { name: 'Keeper\'s Note', description: 'A hastily scrawled note. It reads: "It hates the radio. The frequency... it holds it back. Don\'t let it go silent."' },
};
