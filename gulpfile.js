// Load plugins
var gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  imagemin = require("gulp-imagemin"),
  plumber = require("gulp-plumber"),
  notify = require("gulp-notify"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload;

// globs are basically pattern matches for files. We store them in an object
// because we use them both for gulp.src() as well as gulp.watch()
// if a change to the glob is needed, we simply edit it here rather than in 2 places
var globs = {
  scripts: ["source/js/*.js"],
  styles: ["source/css/**/*.scss"],
  html: ["source/**/*.html"],
  images: ["source/images/**/*"]
};

// HTML
gulp.task("html", function() {
  return gulp
    .src(globs.html)
    .pipe(rename({ dirname: "" })) // flatten directory structure
    .pipe(gulp.dest("_build"))
    .pipe(reload({ stream: true }));
});

// Styles
gulp.task("styles", function() {
  gulp
    .src(globs.styles)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["last 3 versions"]
      })
    )
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("_build/css"))
    .pipe(reload({ stream: true }));
});

// Scripts
gulp.task("scripts", function() {
  return gulp
    .src(globs.scripts)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("_build/scripts"));
  // .pipe(reload({ stream: true }));
});

// Images
gulp.task("images", function() {
  return gulp
    .src(globs.images)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }]
      })
    )
    .pipe(gulp.dest("_build/images"))
    .pipe(reload({ stream: true }));
});

// Browser Sync
gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: "_build"
    }
  });
});

// Watch!
gulp.task("watch", ["browser-sync"], function() {
  gulp.watch(globs.styles, ["styles"]);
  gulp.watch(globs.scripts, ["scripts"]);
  gulp.watch(globs.images, ["images"]);
  gulp.watch(globs.html, ["html"]);
});

// the default tasks runs when you simply type 'gulp'
gulp.task("default", ["styles", "scripts", "images", "html", "watch"]);
