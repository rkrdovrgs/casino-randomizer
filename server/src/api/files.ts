import * as express from "express";
import * as multer from "multer";
import { cast } from "../helpers/object-extensions";
import { connection } from "../db/connection";
import * as path from "path";
import * as fs from "fs";

interface IFileUploadRequest extends Express.Request {
    files: IFile[];
}

const fileRootPath = "__files__/";
const router = express.Router();
const upload = multer({ dest: fileRootPath });
const db = connection("files");


router.post("/api/files", upload.array("files"), (req, res) => {
    let files = cast<IFileUploadRequest>(req).files;
    db.files.insert(
        files,
        (err, result) => {
            if (err) { res.send(err); }
            res.json(result);
        });
});

// router.get("/api/files/:filename", (req, res) => {
//     db.files.findOne({ filename: req.params.filename }, (err, file) => {
//         if (!!file) {
//             try {
//                 res.contentType(file.mimetype);
//                 res.sendFile(path.resolve(file.path));
//             } catch (e) {
//                 res.status(404);
//                 res.json(e);
//             }
//         } else {
//             res.status(404);
//             res.end();
//         }
//     });
// });

router.delete("/api/files/:filename", upload.array("files"), (req, res) => {
    fs.unlinkSync(path.resolve(`${fileRootPath}/${req.params.filename}`));

    db.files.remove(
        { filename: req.params.filename },
        (err, result) => {
            if (err) { res.send(err); }
            res.json(result);
        });
});

module.exports = router;