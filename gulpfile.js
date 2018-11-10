"use strict";

var
  gulp = require("gulp"),
  server = require("browser-sync").create(),
  sass = require("gulp-sass"),
  plumber = require("gulp-plumber"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer");

gulp.task("css", function () {
  return gulp.src("scss/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("scss/**/*.scss", gulp.series("css"));
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "server"));
