import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as api from "./api";
import * as seed from "./db/seed";
import * as  cors from "cors";

var port = process.env.PORT || 3000;
var app = express();

app.use(cors());

app.use("/app/dist", express.static(path.join(__dirname, "../../app/dist")));
app.use("/api/files", express.static(path.join(__dirname, "../../__files__")));


//Body parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

api.configureRoutes(app);
app.use(require("./db/middleware"));
app.use((req, res) => res.sendFile(path.join(__dirname, "../../app/index.html")));

// Syncronyze database
// seed.sync();

app.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("Server started in port:" + port);
});
