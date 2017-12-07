import * as gulp from "gulp";
import * as changedInPlace from "gulp-changed-in-place";
import * as sourcemaps from "gulp-sourcemaps";
import * as less from "gulp-less";
import * as flatten from "gulp-flatten";
import * as concat from "gulp-concat";
import project from "./project";
import { build, CLIOptions } from "aurelia-cli";
import * as minifyCss from "gulp-clean-css";
import * as rename from "gulp-rename";


function copyImages() {
    return gulp.src(["./app/content/images/*.*"])
        .pipe(flatten())
        .pipe(gulp.dest(`./${project.platform.output}/content/images`));
}

function copyFonts() {
    return gulp.src(["./node_modules/font-awesome/fonts/*.*"])
        .pipe(flatten())
        .pipe(gulp.dest(`./${project.platform.output}/content/fonts`));
}


function processCSS() {
    return gulp.src(project.cssProcessor.source)
        .pipe(changedInPlace({ firstPass: true }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(minifyCss())
        //.pipe(rename((path) => { path.dirname = `${project.paths.root}/../${path.dirname}`; }))
        .pipe(build.bundle());
}

function lessPreRender() {
    return gulp.src(["./app/content/less/pre-render.less"])
        .pipe(less())
        .pipe(rename("pre-render.css"))
        .pipe(gulp.dest(`./${project.platform.output}/content/css`));
}

function cssPreRender() {
    return gulp.src([
        "./node_modules/animate.css/animate.css",
        `./${project.platform.output}/content/css/pre-render.css`])
        .pipe(concat("pre-render.css"))
        .pipe(gulp.dest(`./${project.platform.output}/content/css`))
        .pipe(minifyCss({ processImport: false }))
        .pipe(gulp.dest(`./${project.platform.output}/content/css`));
}


let processCssTask;

if (CLIOptions.hasFlag("fast")) {
    processCssTask = gulp.parallel(
        gulp.series(lessPreRender, cssPreRender),
        processCSS
    );
} else {
    processCssTask = gulp.parallel(
        copyImages,
        copyFonts,
        gulp.series(lessPreRender, cssPreRender),
        processCSS
    );
}

export default processCssTask;
