import React, { useMemo } from 'react';
import type { Scene, PlayerState, Choice } from '../types';
import { applyGlitchEffects } from '../utils/textEffects';

const StoryText: React.FC<{text: string, sanity: number, className?: string}> = ({ text, sanity, className }) => {
    const processedText = useMemo(() => applyGlitchEffects(text, sanity), [text, sanity]);
    return (
        <div id="story-text" className={`w-full max-w-4xl p-4 my-4 h-48 overflow-y-auto text-xl leading-relaxed border border-amber-400/30 bg-black/30 ${className || ''}`}>
            {processedText.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
};

const EchoDialogue: React.FC<{text: string, sanity: number}> = ({text, sanity}) => {
    if (!text) return null;
    const processedText = useMemo(() => applyGlitchEffects(text, sanity), [text, sanity]);
    const classes = sanity < 40 ? 'echo-glitch' : '';
    return (
        <div id="echo-dialogue" className={`w-full max-w-4xl p-4 mb-4 h-24 overflow-y-auto text-lg leading-relaxed border bg-black/30 ${classes}`}>
            {processedText}
        </div>
    );
};

const ChoicesContainer: React.FC<{choices: Choice[], onChoiceSelect: (choice: Choice) => void, sanity: number}> = ({ choices, onChoiceSelect, sanity }) => {
    const getChoiceText = (choice: Choice) => {
        return applyGlitchEffects(choice.text, sanity);
    }
    return (
        <div id="choices-container" className="w-full max-w-4xl flex flex-col items-stretch space-y-2">
            {choices.map((choice, index) => (
                <button
                    key={index}
                    onClick={() => onChoiceSelect(choice)}
                    className="p-3 text-lg text-left text-amber-400 border border-amber-400/50 bg-black/50 hover:bg-amber-400/10 hover:text-white transition-colors duration-200"
                >
                   > {getChoiceText(choice)}
                </button>
            ))}
        </div>
    );
};


interface StoryViewProps {
    scene: Scene;
    playerState: PlayerState;
    choices: Choice[];
    onChoiceSelect: (choice: Choice) => void;
    storyTextClasses?: string;
}

const StoryView: React.FC<StoryViewProps> = ({ scene, playerState, choices, onChoiceSelect, storyTextClasses }) => {
    return (
        <>
            <StoryText text={scene.getText(playerState)} sanity={playerState.sanity} className={storyTextClasses} />
            <EchoDialogue text={scene.echoText ? scene.echoText(playerState) : ""} sanity={playerState.sanity} />
            <ChoicesContainer choices={choices} onChoiceSelect={onChoiceSelect} sanity={playerState.sanity} />
        </>
    )
};

export default StoryView;