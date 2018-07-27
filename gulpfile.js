var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  autoprefixer = require('gulp-autoprefixer'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-clean-css');
  sourcemaps = require('gulp-sourcemaps');
  plumber = require('gulp-plumber');
  compileHandlebars = require('gulp-compile-handlebars');
  rename = require('gulp-rename');
  trim = require('gulp-trim');

  var config = {
      server: ["./dist"],
      startPath: '/html/',
      tunnel: true,
      host: 'localhost',
      port: 3000,
      logPrefix: "Egor_Patsyno"
  };


gulp.task('scss', function (cb) {
  return gulp.src("app/scss/main.scss")
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 10 versions'],
        cascade: 1
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.reload({stream: true}))
      cb();
});


gulp.task('html:build', function () {
  const data = {
        j_title: ''
      },
      options = {
        ignorePartials: true,
        batch: [
          'app/html/layouts',
          'app/html/partials'
        ],
        helpers: {
          times: function (n, block) {
            var accum = '';
            for (var i = 0; i < n; ++i)
              accum += block.fn(i + 1);
            return accum;
          },
          ifCond: function (v1, v2, options) {
            if (v1 === v2) {
              return options.fn(this);
            }
            return options.inverse(this);
          }
        }
      };

  return gulp.src([
    'app/html/**/*.hbs',
    '!app/html/layouts/**/*.hbs',
    '!app/html/partials/**/*.hbs'
  ])
      .pipe(plumber())
      .pipe(compileHandlebars(data, options))
      .pipe(rename(path => {
        path.extname = ".html"
      }))
      .pipe(trim())
      .pipe(gulp.dest("dist/html"))
      .pipe(browserSync.stream());
});

gulp.task('fonts:build', gulp.series(function(cb) {
    gulp.src("app/fonts/*.*")
        .pipe(gulp.dest("dist/fonts"))
        .pipe(browserSync.reload({stream: true}));
        cb();
}));

gulp.task('image:build', gulp.series(function(cb) {
    gulp.src("app/img/*.*")
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.reload({stream: true}));
        cb();
}));

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('watch',  function ()  {
    gulp.watch("app/scss/**/*.scss", gulp.series('scss'));
    gulp.watch("app/html/**/*.*", gulp.series('html:build'));
    gulp.watch("app/fonts/*.*", gulp.series('fonts:build'));
    gulp.watch("app/img/*.*", gulp.series('image:build'));
});

gulp.task('default',gulp.parallel('watch', 'webserver'));
