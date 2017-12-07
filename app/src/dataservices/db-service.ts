import { MongoJsCollection } from "shared/mongo-js/collection";

export class DbService {
    categories: MongoJsCollection<{}> = null;
    users: MongoJsCollection<IUser> = null;

    constructor() {
        Object.keys(this).forEach(collection => { this[collection] = new MongoJsCollection().of(collection); });
    }
}