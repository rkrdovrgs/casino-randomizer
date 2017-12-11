export class VoiceHelpers {
    static async getVoices() {
        let voices: SpeechSynthesisVoice[] = [],
            tries = 0;
        do {
            voices = speechSynthesis.getVoices();
            if (!voices.length) {
                await new Promise(res => setTimeout(res, 100));
                tries += 100;
            }
        } while (!voices.length && tries <= 3000);
        return voices;
    }

    static readOutloud(text: string, voice: SpeechSynthesisVoice) {
        let utterance = new SpeechSynthesisUtterance();
        utterance.voice = voice;
        utterance.text = text;
        utterance.rate = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    }
}