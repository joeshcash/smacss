// Requis
var gulp = require('gulp');
//var compass = require('gulp-compass');

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// Variables de chemins
var source = './src'; // dossier de travail
var destination = './dist'; // dossier à livrer

// Tâche "build" = SASS + autoprefixer + CSScomb + beautify (source -> destination)
gulp.task('css', function () {
  return gulp.src(source + '/scss/style.scss')
    //.pipe(plugins.sass({errLogToConsole: true}))
    .pipe(plugins.compass({
      config_file: './config.rb',
      css: 'dist/css',
      sass: 'src/scss'
    }))
    .pipe(plugins.csscomb())
    .pipe(plugins.cssbeautify({indent: '  '}))
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(destination + '/css/'));
});

// Tâche "minify" = minification CSS (destination -> destination)
gulp.task('minify', function () {
  return gulp.src(destination + '/css/*.css')
    .pipe(plugins.csso())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(destination + '/css/'));
});

// Tâche "build"
gulp.task('build', ['css']);

// Tâche "prod" = Build + minify
gulp.task('prod', ['build', 'minify']);

// Tâche "watch" = je surveille *less
gulp.task('watch', function () {
  gulp.watch([
    source + '/scss/*.scss', 
    source + '/scss/layout/*.scss',
    source + '/scss/modules/*.scss'
    ], ['build']
    );
});

// Tâche par défaut
gulp.task('default', ['build']);