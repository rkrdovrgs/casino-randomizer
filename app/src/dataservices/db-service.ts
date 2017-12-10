import { MongoJsCollection } from "shared/mongo-js/collection";

export class DbService {
    figures: MongoJsCollection<IFigure> = null;
    songs: MongoJsCollection<ISong> = null;

    constructor() {
        Object.keys(this).forEach(collection => { this[collection] = new MongoJsCollection().of(collection); });
    }
}