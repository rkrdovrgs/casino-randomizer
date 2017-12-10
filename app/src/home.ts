import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { FileService } from "dataservices/file-service";

@inject(DbService, FileService)
export class Home {
    songs: ISong[];

    constructor(private db: DbService, private fileService: FileService) { }

    async activate() {
        this.songs = await this.db.songs.find();
    }
}

