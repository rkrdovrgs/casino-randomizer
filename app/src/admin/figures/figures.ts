import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";

@inject(DbService)
export class Figures {
    figures: IFigure[] = [];
    newFigure = <IFigure>{};

    constructor(private db: DbService) { }

    async activate() {
        this.initNewFigure();
        this.figures = await this.db.figures.find();
    }

    async addFigure() {
        let r = await this.db.figures.insert(this.newFigure);
        this.newFigure._id = r._id;
        this.figures.unshift(this.newFigure);
        this.initNewFigure();
    }

    async saveFigure(figure: IFigure) {
        await this.db.figures.updateById(figure._id, figure);
    }

    async removeFigure(index, id) {
        await this.db.figures.removeById(id);
        this.figures.splice(index, 1);
    }

    initNewFigure() {
        this.newFigure = <IFigure>{
            eights: 0,
            name: ""
        };
    }
}

