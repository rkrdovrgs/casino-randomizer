import { connection, ObjectId } from "./connection";

var data = require("./data.json");
var db = connection(...Object.keys(data));

export async function sync(force = true) {
    if (!force) { return; }
    Object.keys(data).forEach(collectionName => {
        db[collectionName].drop(() => {
            let collectionData = data[collectionName];
            collectionData.forEach(d => d._id = ObjectId(d._id));
            db[collectionName].insert(collectionData);
        });
    });
}