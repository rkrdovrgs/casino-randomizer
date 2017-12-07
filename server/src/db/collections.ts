interface IDbCollection {
    find(callback): void;
    find(query, callback): void;
    find(query, projection, callback): void;
    findOne(query, callback): void;
    findOne(query, projection, callback): void;
    findAndModify(document, callback): void;
    count(query, callback): void;
    count(callback): void;
    distinct(field, query, callback): void;
    group(document, callback): void;
    insert(docOrDocs, callback?): void;
    mapReduce(map, reduce, options, callback?): void;
    remove(query, callback?): void;
    remove(query, justOne: boolean, callback?): void;
    remove(query, options: Object, callback?): void;
    save(doc, callback?: Function): void;
    save(doc, options?: Object, callback?: Function): void;
    stats(callback): void;
    update(query, update, callback?: Function): void;
    update(query, update, options?: Object, callback?: Function): void;
    toString(): void;
}


export const DbCollections = {
    categories: <IDbCollection>null
};