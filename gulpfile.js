const gulp = require("gulp");
const browserSync = require("browser-sync");
const plugins = require("gulp-load-plugins")();

const reload = browserSync.reload;
const source = "./src";
const dist = "./dist";

gulp.task("css", function() {
  return (
    gulp
      .src(source + "/style.scss")
      //.pipe(plugins.sass({errLogToConsole: true}))
      .pipe(
        plugins.compass({
          config_file: "./config.rb",
          css: "dist/css",
          sass: "src"
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
      .pipe(gulp.dest(dist + "/css/"))
      .pipe(plugins.size())
      .pipe(reload({ stream: true }))
      .on("error", function(error) {
        // Would like to catch the error here
        console.error(error);
        //this.emit("end");
      })
  );
});

gulp.task("copyNotRetina", function() {
  const dest = dist + "img/icons";

  gulp
    .src(dist + "/img/@2x/*.png")
    .pipe(plugins.changed(dest))
    .pipe(
      plugins
        .imageResize({
          width: "50%",
          height: "50%",
          imageMagick: true
        })
        .pipe(gulp.dest(dest))
    );
});

// Tâche "sprite" = spriter les icones
gulp.task("sprite", ["copyNotRetina"], function() {
  const options = {
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  };

  gulp
    .src(dist + "/img/icons/@2x/*.png")
    .pipe(
      plugins.spritesmith({ imgName: "sprite@2x.png", cssName: "_sprite.scss" })
    )
    .pipe(plugins.imagemin(options))
    .pipe(gulp.dest(dist + "/img"));

  sprite = gulp.src(dist + "/img/icons/*.png").pipe(
    plugins.spritesmith({
      imgName: "sprite.png",
      cssName: "_sprite.scss",
      cssSpritesheetName: "sprite",
      cssVarMap: function(sprite) {
        sprite.spritename = sprite.image.replace(".png", "");
        return sprite;
      },
      cssTemplate: source + "helpers/_sprite.scss.mustache"
    })
  );

  sprite.img.pipe(plugins.imagemin(options)).pipe(gulp.dest(dist + "/img"));
  sprite.css.pipe(gulp.dest(source + "/helpers/"));
});

// Tâche "minify" = minification CSS (dist -> dist)
gulp.task("minify", function() {
  return gulp
    .src(dist + "/css/*.css")
    .pipe(plugins.csso())
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(dist + "/css/"));
});

// Tâche "build"
gulp.task("build", ["css"]);

// Tâche "prod" = Build + minify
gulp.task("prod", ["build", "minify"]);

gulp.task("watch", function() {
  browserSync({
    notify: false,
    server: { baseDir: dist }
  });
  gulp.watch(dist + "/*.html", reload);
  gulp.watch(dist + "/js/*.js", reload);
  gulp.watch(
    [
      source + "/*.scss",
      source + "/layout/*.scss",
      source + "/modules/*.scss",
      source + "/helpers/*.scss"
    ],
    ["build"]
  );
});

// Tâche par défaut
gulp.task("default", ["build"]);
