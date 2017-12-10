import * as mongojs from "mongojs";
import { DbCollections } from "./collections";


const connectionString = process.env.MONGODB_URI || "casinorandomizer";

export function connection(...collections: string[]) {
    return mongojs(connectionString, collections);
};

export const db = connection(
    ...Object.keys(DbCollections)
) as typeof DbCollections;

export const ObjectId = mongojs.ObjectId;