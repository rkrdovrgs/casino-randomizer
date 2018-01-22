﻿import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import * as _ from "lodash";
import { VoiceHelpers } from "helpers/voice-helpers";

const settingsKey: string = "settings";
interface IDanceAlongSettings {
    selectedFigures: { [fiigureName: string]: number };
    stepChanger: number;
    maxWapeas: number;
    rueda: boolean;
    maxFigures: number;
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
    figureDelay: number = 1;

    stepChanger: number;
    maxWapeas: number;
    maxFigures: number;
    rueda: boolean;

    //eights include "dile que no"
    figures: IFigure[] = [];
    song: ISong;
    dameCounter: number = 0;
    dame = <IFigure>{
        name: "dame",
        eights: 1
    };

    voice: SpeechSynthesisVoice;


    constructor(private db: DbService) { }

    async activate({ songId }) {
        this.song = await this.db.songs.findById(songId);
        this.figures = await this.db.figures.find();
        this.figures = _.sortBy(this.figures, f => (f.rueda || false));

        this.stepInterval = this.song.eigthInterval / 8;
        this.setSettings();

        let voices = await VoiceHelpers.getVoices();
        this.voice = voices.find(v => ["es-es", "es-us"].includes(v.lang.toLocaleLowerCase()));
    }

    bind() {
        this.audioElement.onplay = () => {
            this.playing = true;
            VoiceHelpers.readOutloud("Iniciando", this.voice);
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
                    let randomFigureIndex = this.generateRandom(selectedFigures.length - 1),
                        randomWapeas = this.generateRandom(this.maxWapeas);
                    this.currentFigure = selectedFigures[randomFigureIndex];

                    if (this.rueda) {
                        if (this.dameCounter < this.generateRandom(this.maxFigures - 1) + 1) {
                            this.dameCounter += 1;
                        } else {
                            this.dameCounter = 0;
                            this.currentFigure = this.dame;
                        }
                    }

                    this.figureDelay = randomWapeas > 0 ? 1 : 0;
                    this.figureCounter = this.currentFigure.eights + randomWapeas;

                } else {
                    this.figureCounter -= 1;
                }

                if (!!this.currentFigure && (this.currentFigure.eights + this.figureDelay) === this.figureCounter) {
                    VoiceHelpers.readOutloud(this.currentFigure.name, this.voice);
                }
            }

        }, this.stepInterval)
    }

    generateRandom(max): number {
        if (max <= 0) return 0;
        return Math.floor(Math.random() * (max + 1))

    }

    setSettings() {
        // get from localstorage
        let settings: IDanceAlongSettings =
            Object.assign(<IDanceAlongSettings>{
                maxWapeas: 2,
                stepChanger: 7,
                rueda: false,
                maxFigures: 1,
                selectedFigures: _(this.figures).keyBy(x => x.name)
                    .mapValues(() => 1)
                    .value()
            }, JSON.parse(localStorage.getItem("settings")));

        this.maxWapeas = settings.maxWapeas;
        this.stepChanger = settings.stepChanger;
        this.rueda = settings.rueda;
        this.maxFigures = settings.maxFigures;

        this.figures.forEach(f => {
            f.selected = this.rueda ? !!settings.selectedFigures[f.name] : (!!settings.selectedFigures[f.name] && !f.rueda);
            f.stats = f.selected ? (settings.selectedFigures[f.name] || 0) : 0;
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
            rueda: this.rueda,
            maxFigures: this.maxFigures,
            selectedFigures: _(this.figures).filter(x => x.selected)
                .keyBy(x => x.name)
                .mapValues(x => x.stats || 1)
                .value()
        };
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    resetSettings() {
        localStorage.removeItem("settings");
        this.setSettings();
    }

    setRueda() {
        this.figures.filter(f => f.rueda).forEach(f => {
            f.selected = this.rueda;
            f.stats = this.rueda ? 1 : 0;
        });
        this.maxFigures = 1;
        this.updateSettings();
    }
}