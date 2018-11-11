import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import * as _ from "lodash";

const DefaultStyle = "casino";

@inject(DbService)
export class Figures {
    figures: IFigure[] = [];
    newFigure = <IFigure>{};
    style: string;

    constructor(private db: DbService) { }

    async activate(params: { style: string }) {
        this.style = params.style;
        this.initNewFigure();
        this.figures = _(await this.db.figures.find())
            .filter(f => (f.style || DefaultStyle) === this.style)
            .orderBy([f => f.createdAt], ["desc"])
            .value();
    }

    async addFigure() {
        this.newFigure.createdAt = new Date();
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
            name: "",
            rueda: false,
            style: this.style
        };
    }
}

