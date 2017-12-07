import * as fs from "fs";

export function configureRoutes(app) {
    let env = process.env.NODE_ENV || "development",
        ext = env === "development" ? ".ts" : ".js";

    fs.readdirSync("./server/src/api")
        .filter(f => f.endsWith(ext) && !f.startsWith("index."))
        .map(f => f.replace(ext, ""))
        .forEach(file => {
            var route = require("./" + file);
            app.use(route);
        });
};
