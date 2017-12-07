import * as gulp from "gulp";
import transpile from "./transpile";
import processMarkup from "./process-markup";
import processCSS from "./process-css";
import { CLIOptions, build } from "aurelia-cli";
import project from "./project";

export default gulp.series(
    readProjectConfiguration,
    gulp.parallel(
        transpile,
        processMarkup,
        processCSS
    ),
    writeBundles
);

export let buildSystemUnderTest = gulp.series(
    readTestProjectConfiguration,
    writeBundles
);

function readProjectConfiguration() {
    if (CLIOptions.hasFlag("fast")) {
        project.build.bundles = project.build.bundles.filter(b => b.name === "app-bundle.js");
    }

    return build.src(project);
}

function readTestProjectConfiguration() {
    //for running the unit tests, the app-bundle is not needed as files are process using the karma typescript-preprocessor
    project.build.bundles = project.build.bundles.filter(b => b.name !== "app-bundle.js");
    return build.src(project);
}

function writeBundles() {
    return build.dest();
}
