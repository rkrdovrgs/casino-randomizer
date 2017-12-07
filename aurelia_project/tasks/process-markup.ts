import * as gulp from "gulp";
import * as htmlmin from "gulp-htmlmin";
import * as changedInPlace from "gulp-changed-in-place";
import project from "./project";
import { build } from "aurelia-cli";

export default function processMarkup() {
    return gulp.src(project.markupProcessor.source)
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            minifyCSS: true,
            minifyJS: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        //.pipe(rename((path) => { path.dirname = `${project.paths.root}/${path.dirname.replace(project.paths.src, project.paths.root)}`; }))
        .pipe(build.bundle());
}
