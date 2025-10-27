import { CodexEntry } from '../types';
import { items } from './items';

export const codexData: Record<string, CodexEntry> = {
    'item_radio': { id: 'item_radio', title: 'Weak Radio', content: items['Weak Radio'].description },
    'item_crowbar': { id: 'item_crowbar', title: 'Crowbar', content: items['Crowbar'].description },
    'item_painkillers': { id: 'item_painkillers', title: 'Painkillers', content: items['Painkillers'].description },
    'item_diary': { id: 'item_diary', title: 'Old Diary', content: items['Old Diary'].description },
    'item_booster': { id: 'item_booster', title: 'Signal Booster', content: items['Signal Booster'].description },
    'item_key': { id: 'item_key', title: 'Generator Key', content: items['Generator Key'].description },
    'item_fuse': { id: 'item_fuse', title: 'Fuse', content: items['Fuse'].description },
    'item_keepers_note': { id: 'item_keepers_note', title: 'Keeper\'s Note', content: items['Keeper\'s Note'].description },

    'diary_entry_1': { id: 'diary_entry_1', title: "Keeper's Entry: Day 4", content: "'Day 4: The light... it shows me things. Angles that don't fit. Colors my eyes shouldn't see. At first, it was beautiful. Now, I'm afraid to look.'"},
    'diary_entry_2': { id: 'diary_entry_2', title: "Keeper's Entry: Day 10", content: "'Day 10: I hear it scratching in the walls. The other keeper, Thomas, says it's just rats. But rats don't whisper my name.'"},
    'diary_entry_3': { id: 'diary_entry_3', title: "Keeper's Entry: Day 18", content: "'Day 18: Thomas is gone. Just... gone. I saw him walk into the lantern room and he never came out. The light is a different color now. I have to break it. I have to keep it dark.'"},
    
    'generator_manual': { id: 'generator_manual', title: "Generator Manual Fragment", content: "WARNING: Do not attempt to engage primary ignition without a certified industrial-grade fuse installed. Failure to do so may result in catastrophic overload and... [The rest of the page is scorched and unreadable]."},
    
    'echo_tomb': { id: 'echo_tomb', title: 'ECHO: The Tomb', content: ">> THIS PLACE IS A TOMB. <<"},
    'echo_keeper': { id: 'echo_keeper', title: 'ECHO: The Keeper', content: ">> THOMAS. HIS NAME WAS THOMAS. HE HEARD THE WHISPERS. HE SAW THE ANGLES. HE TRIED TO WARN US. HE IS THE STATIC NOW. <<"},
    'echo_frequency': { id: 'echo_frequency', title: 'ECHO: The Frequency', content: ">> THE BROADCAST IS A CAGE. A LULLABY. IT KEEPS THE DREAMER ASLEEP. IF THE SONG STOPS, THE DREAMER WAKES. <<"},
};
