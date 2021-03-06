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
    random: boolean;
    fireAndForget: boolean;
}

@inject(DbService)
export class DanceAlong {
    audioElement: HTMLAudioElement;
    playing: boolean;

    stepCounter: number;
    stepCounterDisplay: string;
    stepInterval: number;
    stepIntervalId: NodeJS.Timer;
    currentFigure: IFigure;
    figureCounter: number = 0;
    figureDelay: number = 1;

    stepChanger: number;
    maxWapeas: number;
    maxFigures: number;
    rueda: boolean;
    random: boolean = true;
    fireAndForget: boolean;

    resetConfig = {
        lastNumberOfFigures: 7,
        incremental: false,
        includeAll: false
    }

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
        this.figures = _.orderBy(
            await this.db.figures.find(),
            [f => (f.rueda || false), f => f.createdAt],
            ["asc", "desc"]
        );

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

        this.audioElement.onended = () => {
            this.stopStepCounter();
        }
    }

    unbind() {
        this.stopStepCounter();
    }

    playStepCounter() {
        this.audioElement.play();
        this.audioElement.volume = this.song.volume || 0.25;
    }

    stopStepCounter(stopSong: boolean = true) {
        clearTimeout(this.stepIntervalId);
        if (stopSong) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.playing = false;
        }
        this.currentFigure = null;
        this.stepCounter = null;

        if (this.fireAndForget) {
            this.updateSettings();
        }
    }

    restartStepCounter() {
        this.stopStepCounter();
        this.playStepCounter();
    }

    getSelectedFigures(): IFigure[] {
        return _(this.figures)
            .filter(f => f.selected)
            .flatMap(f => Array(f.stats).fill(f))
            .value();
    }

    initStepCounter() {
        let selectedFigures = this.getSelectedFigures();

        if (!selectedFigures.length) {
            this.playing = false;
            return;
        }


        if (this.stepIntervalId) {
            clearTimeout(this.stepIntervalId);
        }

        this.stepCounter = 1;
        this.figureCounter = 0;
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
                    if (!selectedFigures.length) {
                        selectedFigures = this.getSelectedFigures();

                        // when fire and forget is enabled, this won't repopulate and will be empty
                        if (!selectedFigures.length) {
                            this.stopStepCounter(false);
                            VoiceHelpers.readOutloud("No hay mas figuras", this.voice);
                        }
                    }

                    let randomFigureIndex = this.random ? this.generateRandom(selectedFigures.length - 1) : 0,
                        randomWapeas = this.random ? this.generateRandom(this.maxWapeas) : this.maxWapeas;
                    this.currentFigure = selectedFigures[randomFigureIndex];

                    if (this.rueda) {
                        if (this.dameCounter < this.generateRandom(this.maxFigures - 1) + 1) {
                            this.dameCounter += 1;
                        } else {
                            this.dameCounter = 0;
                            this.currentFigure = this.dame;
                        }
                    }

                    if (this.currentFigure.name !== this.dame.name) {
                        selectedFigures.splice(randomFigureIndex, 1);
                        if (this.fireAndForget) {
                            let origFigure = this.figures.find(f => f._id === this.currentFigure._id);
                            origFigure.selected = false;
                            origFigure.stats = 0;
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
                random: true,
                maxWapeas: 3,
                fireAndForget: false,
                stepChanger: 7,
                rueda: false,
                maxFigures: 1,
                selectedFigures: _(this.figures).keyBy(x => x.name)
                    .mapValues(() => 1)
                    .value()
            }, JSON.parse(localStorage.getItem("settings")));

        this.stepChanger = settings.stepChanger;
        this.rueda = settings.rueda;
        this.maxFigures = settings.maxFigures;
        this.maxWapeas = settings.maxWapeas;
        this.fireAndForget = settings.fireAndForget;
        this.random = settings.random;

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
            random: this.random,
            maxWapeas: this.maxWapeas,
            stepChanger: this.stepChanger,
            rueda: this.rueda,
            maxFigures: this.maxFigures,
            fireAndForget: this.fireAndForget,
            selectedFigures: _(this.figures).filter(x => x.selected)
                .keyBy(x => x.name)
                .mapValues(x => x.stats || 1)
                .value()
        };
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    resetSettings(random: boolean = true, fireAndForget: boolean = false, maxWapeas: number = 3) {
        localStorage.removeItem("settings");
        this.setSettings();

        this.random = random;
        this.fireAndForget = fireAndForget
        this.maxWapeas = maxWapeas;
    }

    resetSettingsForLastFigures(lastNumberOfFigures, incremental, includeAll, practiceLastFigure) {
        this.resetSettings();
        let figures = this.figures.filter(f => !f.rueda),
            startIncremental = includeAll ? figures.length : lastNumberOfFigures,
            decreaseBy = includeAll ? Math.floor(startIncremental / lastNumberOfFigures) : 1;

        figures
            .map(f => {
                if (!includeAll) {
                    f.selected = false;
                    f.stats = 0;
                }
                return f;
            })
            .slice(0, lastNumberOfFigures)
            .forEach(f => {
                f.selected = true;
                if (!incremental) {
                    f.stats = includeAll ? figures.length : 1;
                } else {
                    f.stats = startIncremental;
                    startIncremental -= decreaseBy;
                }
            });

        if (practiceLastFigure) {
            figures[0].stats = lastNumberOfFigures;
        }

        this.updateSettings();
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