import { ApiService } from "shared/api-service/api";
import { inject } from "aurelia-framework";


@inject(ApiService)
export class FileService {
    constructor(private api: ApiService) { }

    upload(files: IFile | IFile[]): Promise<void> {
        if (!!(<IFile>files).content && !!(<IFile>files).content.length) {
            let formData = new FormData();
            for (let i = 0; i < (<IFile>files).content.length; i++) {
                formData.append("files", (<IFile>files).content[i]);
            }

            return this.api.fetch("/api/files",
                {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(files)) {
                        delete (<any>files).content;
                        files.push(...data);
                    } else {
                        delete files.content;
                        Object.assign(files, data[0]);
                    }
                });
        }
    }

    remove(file: IFile) {
        return this.api.delete(`/api/files/${file.filename}`);
    }
}