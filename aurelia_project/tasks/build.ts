import * as gulp from "gulp";
import project from "./project";
import buildSystem, { buildSystemUnderTest } from "./build-system";
import { CLIOptions } from "aurelia-cli";
import { watch } from "./watch";

const build = CLIOptions.instance.taskPath.endsWith("test.ts") ? buildSystemUnderTest : buildSystem;

export default !CLIOptions.hasFlag("watch") ?
    build :
    gulp.series(
        build,
        watch([
            project.transpiler.source,
            project.markupProcessor.source,
            project.cssProcessor.source,
            project.cssProcessor.dependencies
        ], build)
    );