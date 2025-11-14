import errorSound from "../assets/sounds/errorv2.mp3";
import successSound from "../assets/sounds/success.mp3";

const sounds = {
    error: new Audio(errorSound),
    success: new Audio(successSound),
};

export function playSound(type = "error") {
    const sound = sounds[type];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
}

export const playErrorSound = () => playSound("error");
export const playSuccessSound = () => playSound("success");