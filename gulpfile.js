var gulp = require("gulp"),
    less = require("gulp-less"),
    browserSync = require("browser-sync"),
    eslint = require('gulp-eslint'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    path = {
        HTML : "html/*.html",
        LESS : "less/*.less",
        CSS : "css/*.css",
        JS : "js/*.js"
    };

    // We'll use mocha in this example, but any test framework will work


    gulp.task('pre-test', function () {
      return gulp.src(['js/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
    });

    gulp.task('test', ['pre-test'], function () {
      return gulp.src(['test/*.js'])
        .pipe(mocha())
        // Creating the reports after tests ran
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
        .pipe(istanbul.writeReports({
          dir: './assets/unit-test-coverage',
              reporters: [ 'lcov' ],
              reportOpts: { dir: './assets/unit-test-coverage'} }));
    });
    

gulp.task('lint', function() {
  return gulp.src(path.JS)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task("serve", ["less", "js-watch", "html"], function() {
    browserSync.init({
        server : "./"
    });

    gulp.watch(path.LESS, ["less"]);
    gulp.watch(path.JS, ["js-watch"]);
    gulp.watch(path.HTML, ["html"]);
    gulp.watch(path.HTML).on("change", function() {
        browserSync.reload;
    });
});


gulp.task("less", function() {
    gulp.src(path.LESS)
        .pipe(less())
        .pipe(gulp.dest(path.CSS))
        .pipe(browserSync.stream());
})


gulp.task("js-watch", function() {
    gulp.src(path.JS)
    .pipe(browserSync.stream());
})

gulp.task("html", function() {
    gulp.src(path.HTML)
    .pipe(browserSync.stream());
})

gulp.task("default", ["serve"])
