export class Home {
    audioElement: Element;
    playing: boolean;
    audioLoadingProgress: number;

    stepCounter: number;
    stepCounterDisplay: string;
    stepChanger: number = 4;
    stepInterval: number = 353.75;
    stepIntervalId: number;
    stepStartDelay: number = 1600;
    currentFigure;
    figureCounter:number = 0;
    maxWapeas: number = 3;

    //eights include "dile que no"
    figures = [
        {name: "fly", eights: 1},        
        {name: "enchufla", eights: 2},
        {name: "enchufla doble", eights: 3},
        {name: "kentuky", eights: 3},
        {name: "candado", eights: 4},
        {name: "sombrero", eights: 2},
        {name: "montana", eights: 4},
        {name: "el dedo", eights: 4},
        {name: "adios con hermana", eights: 3},
        {name: "setenta", eights: 4}
    ];

    activate() {
        this.figures.forEach(f => {
            f.selected = true;
        });
    }

    bind() {
        this.audioElement.onplay = () => this.initStepCounter();
    }

    unbind() {
        this.stopStepCounter();
    }

    playStepCounter() {
        this.audioElement.play();
    }

    stopStepCounter() {
        clearTimeout(this.stepIntervalId);
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.currentFigure  = null;
        this.stepCounter = null;
        this.playing = false;
    }

    restartStepCounter() {
        this.stopStepCounter();
        this.initStepCounter();
    }
 
    async initStepCounter() {
        let selectedFigures = this.figures.filter(f => f.selected);
        if(!selectedFigures.length) return;

        this.playing = true;
        //this.audioElement.play();
        await new Promise(res => setTimeout(res, 1500));
        if(this.stepIntervalId) {
            clearTimeout(this.stepIntervalId);
        }

        this.stepCounter = 1;
        this.stepIntervalId = setInterval(() => {
            if(this.stepCounter >= 8) {   
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

            if(this.stepCounter === this.stepChanger) {
                if(this.figureCounter <= 0) {
                    let randomFigureIndex = this.generateRandom(selectedFigures.length) - 1,
                        randomWapeas = this.generateRandom(this.maxWapeas);

                    this.currentFigure = selectedFigures[randomFigureIndex];
                    this.figureCounter = this.currentFigure.eights + randomWapeas;
                } else {
                    this.figureCounter -= 1;
                }
            }

        }, this.stepInterval)
    }

    generateRandom(max) : number {
        return Math.floor(Math.random() * max) + 1 
    }


}