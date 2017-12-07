import * as gulp from "gulp";

export function onChange(path) {
    // tslint:disable-next-line:no-console
    console.log(`File Changed: ${path}`);
}

export function watch(sources, refreshCb) {
    return function (done) {
        gulp.watch(sources, refreshCb).on("change", onChange);
    };
};