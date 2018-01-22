import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { FileService } from "dataservices/file-service";
import * as _ from "lodash";

@inject(DbService, FileService)
export class Home {
    songs: ISong[];

    constructor(private db: DbService, private fileService: FileService) { }

    async activate() {
        this.songs = await this.db.songs.find();
        this.songs = _.sortBy(this.songs, s => s.name);
    }
}

