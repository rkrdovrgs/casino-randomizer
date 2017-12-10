import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import * as _ from "lodash";

const settingsKey: string = "settings";
interface IDanceAlongSettings {
    selectedFigures: { [fiigureName: string]: number };
    stepChanger: number;
    maxWapeas: number;
}

@inject(DbService)
export class DanceAlong {
    audioElement: HTMLAudioElement;
    playing: boolean;

    stepCounter: number;
    stepCounterDisplay: string;
    stepInterval: number;
    stepIntervalId: NodeJS.Timer;
    currentFigure;
    figureCounter: number = 0;

    stepChanger: number;
    maxWapeas: number;

    //eights include "dile que no"
    figures: IFigure[] = [];
    song: ISong;

    voice: SpeechSynthesisVoice;


    constructor(private db: DbService) { }

    async activate({ songId }) {
        this.song = await this.db.songs.findById(songId);
        this.figures = await this.db.figures.find();

        this.stepInterval = this.song.eigthInterval / 8;
        this.setSettings();


        let voices = await new Promise<SpeechSynthesisVoice[]>(res => {
            speechSynthesis.getVoices();
            setTimeout(() => res(speechSynthesis.getVoices()), 1000)
        });

        console.log(voices);

        this.voice = voices.find(v => ["es-es", "es-us"].includes(v.lang.toLocaleLowerCase()));
    }

    bind() {
        this.audioElement.onplay = () => {
            this.playing = true;
            let playIntervalId = setInterval(() => {
                if (this.audioElement.currentTime >= (this.song.startDelay / 1000)) {
                    clearInterval(playIntervalId);
                    this.initStepCounter();
                }
            }, 10);
        };
    }

    unbind() {
        this.stopStepCounter();
    }

    playStepCounter() {
        this.audioElement.play();
        this.audioElement.volume = 0.25;
    }

    stopStepCounter() {
        clearTimeout(this.stepIntervalId);
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.currentFigure = null;
        this.stepCounter = null;
        this.playing = false;
    }

    restartStepCounter() {
        this.stopStepCounter();
        this.playStepCounter();
    }

    initStepCounter() {
        let selectedFigures = _(this.figures)
            .filter(f => f.selected)
            .flatMap(f => Array(f.stats).fill(f))
            .value();

        if (!selectedFigures.length) {
            this.playing = false;
            return;
        }


        if (this.stepIntervalId) {
            clearTimeout(this.stepIntervalId);
        }

        this.stepCounter = 1;
        this.stepIntervalId = setInterval(() => {
            if (this.stepCounter >= 8) {
                this.stepCounter = 0;
            }
            this.stepCounter += 1;
            switch (this.stepCounter) {
                case 4:
                case 8:
                    this.stepCounterDisplay = "tap";
                    break;
                default:
                    this.stepCounterDisplay = this.stepCounter.toString();
                    break;
            }

            if (this.stepCounter === this.stepChanger) {
                //<=1 or <=0
                if (this.figureCounter <= 1) {
                    let randomFigureIndex = this.generateRandom(selectedFigures.length) - 1,
                        randomWapeas = this.generateRandom(this.maxWapeas);

                    this.currentFigure = selectedFigures[randomFigureIndex];
                    this.figureCounter = this.currentFigure.eights + randomWapeas;

                } else {
                    this.figureCounter -= 1;
                }

                if (!!this.currentFigure && (this.currentFigure.eights + 1) === this.figureCounter) {
                    this.readOutloud(this.currentFigure.name);
                }
            }

        }, this.stepInterval)
    }

    generateRandom(max): number {
        if (max <= 0) return 0;
        return Math.floor(Math.random() * max) + 1
    }

    setSettings(reset = false) {
        // get from localstorage
        let settings: IDanceAlongSettings =
            Object.assign(<IDanceAlongSettings>{
                maxWapeas: 2,
                stepChanger: 4,
                selectedFigures: _(this.figures).keyBy(x => x.name)
                    .mapValues(x => reset ? 1 : (x.stats || 1))
                    .value()
            }, JSON.parse(localStorage.getItem("settings")));

        this.maxWapeas = settings.maxWapeas;
        this.stepChanger = settings.stepChanger;

        this.figures.forEach(f => {
            f.selected = !!settings.selectedFigures[f.name];
            f.stats = settings.selectedFigures[f.name] || 0;
        });
    }

    updateSettings() {
        this.figures.forEach(f => {
            if (f.selected) {
                f.stats = !f.stats || f.stats <= 0 ? 1 : f.stats;
            } else {
                f.stats = 0;
            }
        });

        let settings: IDanceAlongSettings = {
            maxWapeas: this.maxWapeas,
            stepChanger: this.stepChanger,
            selectedFigures: _(this.figures).filter(x => x.selected)
                .keyBy(x => x.name)
                .mapValues(x => x.stats || 1)
                .value()
        };
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    resetSettings() {
        localStorage.removeItem(settingsKey);
        this.setSettings(true);
    }

    readOutloud(text: string) {
        let utterance = new SpeechSynthesisUtterance();
        utterance.voice = this.voice;
        utterance.text = text;
        utterance.rate = 1.25;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    }


}