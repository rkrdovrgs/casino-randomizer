import * as gulp from "gulp";
import * as tslint from "gulp-tslint";
import { CLIOptions } from "aurelia-cli";
import { watch } from "./watch";

const sources = ["**/*.ts", "!node_modules/**/*.ts"];

export function lint() {
    return gulp.src(sources)
        .pipe(tslint())
        .pipe(tslint.report("prose", {
            emitError: CLIOptions.hasFlag("strict")
        }));
}

export default CLIOptions.hasFlag("watch") ? gulp.series(lint, watch(sources, lint)) : lint;