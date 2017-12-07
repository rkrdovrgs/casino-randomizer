import { ApiService } from "shared/api-service/api";
import { Container } from "aurelia-framework";

interface IMongoJsResult {
    ok: number;
    n: number;
}

export class MongoJsCollection<T> {
    private collection: string;
    private api: ApiService;

    constructor() {
        this.api = Container.instance.get(ApiService);
    }

    of(collection: string) {
        this.collection = collection;
        return this;
    }

    find(filter = {}): Promise<T[]> {
        return this.api.get(`api/${this.collection}`, { filter: JSON.stringify(filter) });
    }

    findOne(filter = {}): Promise<T> {
        return this.api.get(`api/${this.collection}`, { filter: JSON.stringify(filter), multi: false });
    }

    findById(id: string): Promise<T> {
        return this.api.get(`api/${this.collection}/${id}`);
    }

    insert(docOrDocs: T): Promise<T> {
        return this.api.post(`api/${this.collection}`, docOrDocs)
            .then(r => r.json());
    }

    update(filter = {}, doc: T): Promise<IMongoJsResult> {
        let searchParams = new URLSearchParams();
        searchParams.set("filter", JSON.stringify(filter));
        return this.api.put(`api/${this.collection}?${searchParams.toString()}`, doc)
            .then(r => r.json());

    }

    updateById(id: string, doc: T): Promise<IMongoJsResult> {
        return this.api.put(`api/${this.collection}/${id}`, doc)
            .then(r => r.json());

    }

    remove(filter = {}): Promise<IMongoJsResult> {
        let searchParams = new URLSearchParams();
        searchParams.set("filter", JSON.stringify(filter));
        return this.api.delete(`api/${this.collection}?${searchParams.toString()}`)
            .then(r => r.json());

    }

    removeById(id: string): Promise<IMongoJsResult> {
        return this.api.delete(`api/${this.collection}/${id}`)
            .then(r => r.json());

    }
}