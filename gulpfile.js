// Requis
const gulp = require("gulp");
const uglify = require("gulp-uglify-es").default;

// Include plugins
const plugins = require("gulp-load-plugins")(); // tous les plugins de package.json

// Variables de chemins
const source = "./src"; // dossier de travail
const destination = "./dist"; // dossier à livrer

// Tâche "build" = SASS + autoprefixer + CSScomb + beautify (source -> destination)
gulp.task("css", function() {
  return (
    gulp
      .src(source + "/scss/style.scss")
      //.pipe(plugins.sass({errLogToConsole: true}))
      .pipe(
        plugins.compass({
          config_file: "./config.rb",
          css: "dist/css",
          sass: "src/scss"
        })
      )
      .pipe(plugins.csscomb())
      .pipe(plugins.cssbeautify({ indent: "  " }))
      .pipe(
        plugins.autoprefixer(
          "last 2 version",
          "safari 5",
          "ie 7",
          "ie 8",
          "ie 9",
          "opera 12.1",
          "ios 6",
          "android 4"
        )
      )
      .pipe(gulp.dest(destination + "/css/"))
  );
});

// Tâche "minify" = minification CSS (destination -> destination)
gulp.task("minifyCss", function() {
  return gulp
    .src(destination + "/css/*.css")
    .pipe(plugins.csso())
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(destination + "/css/"));
});

// Gulp task to minify JavaScript files
gulp.task("minifyJs", function() {
  return (
    gulp
      .src(destination + "/js/*.js")
      // Minify the file
      .pipe(
        uglify().on("error", function(e) {
          console.log(e);
        })
      )
      .pipe(
        plugins.rename({
          suffix: ".min"
        })
      )
      // Output
      .pipe(gulp.dest(destination + "/js/"))
  );
});

// Gulp task to minify HTML files
gulp.task("pages", function() {
  return gulp
    .src(destination + "/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(destination + "/"));
});

// Clean output directory
//gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
// gulp.task('default', ['clean'], function () {
//   runSequence(
//     'styles',
//     'scripts',
//     'pages'
//   );
// });

// Tâche "build"
gulp.task("build", ["css"]);

// Tâche "prod" = Build + minify
gulp.task("prod", ["build", "minifyCss", "minifyJs"]);

// Tâche "watch" = je surveille *less
gulp.task("watch", function() {
  gulp.watch(
    [
      source + "/scss/*.scss",
      source + "/scss/layout/*.scss",
      source + "/scss/modules/*.scss"
    ],
    ["build"]
  );
});

// Tâche par défaut
gulp.task("default", ["build"]);
