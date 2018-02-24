import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { FileService } from "dataservices/file-service";
import * as _ from "lodash";

@inject(DbService, FileService)
export class Songs {
    songs: ISong[];

    constructor(private db: DbService, private fileService: FileService) { }

    async activate() {
        this.songs = _.orderBy(
            await this.db.songs.find(),
            [s => s.name.startsWith("(not ready)"), s => s.eigthInterval],
            ["asc", "desc"]
        );
    }

    async removeSong(index, id) {
        await this.fileService.remove(this.songs[index].audio);
        await this.db.songs.removeById(id);
        this.songs.splice(index, 1);
    }
}

