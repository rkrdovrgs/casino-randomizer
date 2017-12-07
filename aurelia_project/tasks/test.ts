import * as gulp from "gulp";
import { Server as Karma } from "karma";
import { CLIOptions } from "aurelia-cli";
import build from "./build";

const coverageTreshold = 60;
const coverageTresholdMin = coverageTreshold - 25;
let karma = done => {
    new Karma({
        configFile: __dirname + "/../../karma.conf.js",
        singleRun: !CLIOptions.hasFlag("watch"),
        coverageReporter: {
            type: "html",
            dir: "coverage/",
            subdir: ".",
            includeAllSources: true,
            watermarks: {
                statements: [coverageTresholdMin, coverageTreshold],
                functions: [coverageTresholdMin - 10, coverageTreshold - 10],
                branches: [coverageTresholdMin - 25, coverageTreshold - 25],
                lines: [coverageTresholdMin, coverageTreshold]
            },
            check: !CLIOptions.hasFlag("strict") ? undefined : {
                each: {
                    statements: coverageTreshold,
                    functions: coverageTreshold - 10,
                    lines: coverageTreshold,

                    //@note: DO NOT EXCLUDE UNLESS NECESSARY
                    excludes: [
                        // dataservices are always mocked as their only job is to make api calls
                        "src/dataservices/*.ts",
                        "src/config/*.ts",
                        "src/resources/index.ts",
                        "src/elements/index.ts",
                        "src/main.ts",
                        "src/app.ts",
                        "src/environment.ts"
                    ]
                }
            }
        }
    }, done).start();
};

let unit = CLIOptions.hasFlag("fast") ?
    gulp.series(karma) :
    gulp.series(build, karma);

export default unit;
