import { inject } from "aurelia-framework";
import { DbService } from "dataservices/db-service";
import { Router } from "aurelia-router";
import { FileService } from "dataservices/file-service";

@inject(DbService, FileService, Router)
export class SongDetails {
    song: ISong;

    constructor(private db: DbService, private fileService: FileService, private router: Router) { }

    async activate({ songId }) {
        if (!songId) {
            this.song = <ISong>{
                name: "",
                eigthInterval: 0,
                startDelay: 0
            };
        } else {
            this.song = await this.db.songs.findById(songId);
        }
    }

    async saveSong() {
        if (!!this.song.audio.content) {
            await this.fileService.upload(this.song.audio);
        }

        if (!this.song._id) {
            await this.db.songs.insert(this.song);
        } else {
            await this.db.songs.updateById(this.song._id, this.song);
        }

        this.router.navigateToRoute("admin-songs");
    }
}

