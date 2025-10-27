import { GameData } from '../types';
import { exteriorScenes } from './01_Exterior';
import { basementScenes } from './02_Basement';
import { engineRoomScenes } from './03_EngineRoom';
import { mainFloorScenes } from './04_MainFloor';
import { upperLevelScenes } from './05_UpperLevels';
import { endingScenes } from './endings';

export const gameData: GameData = {
    ...exteriorScenes,
    ...basementScenes,
    ...engineRoomScenes,
    ...mainFloorScenes,
    ...upperLevelScenes,
    ...endingScenes,
};
