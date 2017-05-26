const gulp          = require('gulp'),
      notify        = require('gulp-notify'),
      del           = require('del'),
      concat        = require('gulp-concat'),
      vendorFiles   = require('gulp-main-bower-files'),
      minify        = require('gulp-minify'),
      gulpFilter    = require('gulp-filter'),
      source        = require('vinyl-source-stream'),
      cleanCSS      = require('gulp-clean-css'),
      browserify    = require('browserify'),
      babelify      = require('babelify'),
      ngAnnotate    = require('browserify-ngannotate'),
      fileinclude   = require('gulp-file-include'),
      uglify        = require('gulp-uglify'),
      rename        = require("gulp-rename"),
      fs            = require("fs"),
      merge         = require('merge-stream');

function  interceptErrors(error) {
  let args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}



const config = JSON.parse(fs.readFileSync('./config.json'));


gulp.task('fonts', () => {
  return gulp.src(config.fonts)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir+'/fonts/'));
});


gulp.task('png-images', () => {
  return gulp.src(config.img.png)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('icons', () => {
  return gulp.src(config.img.icons)
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir+'/img/'));
});


gulp.task('bower-main', () => {
  return allJs = gulp.src('./bower.json')
      .pipe(vendorFiles({
        base: "src/lib",}))
      .pipe(gulpFilter(['**/*.js']))
      .pipe(gulp.dest(config.buildDir + '/vendor/'));
});


gulp.task('all-js', ['bower-main'], () => {
  return gulp.src([
    config.buildDir + '/vendor/**/*.js',
    './src/lib/moment/locale/uk.js',
    './src/lib/moment/locale/ru.js',
    './src/lib/puchdb/**/*.js',
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('css', () => {
  return gulp.src(config.styles)
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS())
    .on('error', interceptErrors)
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('htmlPages', () => {
  return merge(config.html.map((page) => {
    return gulp.src('./templates/base.html')
    .pipe(fileinclude({
      prefix: '@@',
      indent: true,
      context: {
        title: page.title,
        name: page.name,
        scripts: page.scripts,
	controller: page.controller,
        db_url: config.dbUrl,
        auctions_server: config.auctions_server
      }}))
    .on('error', interceptErrors)
    .pipe(rename(page.name +'.html'))
    .pipe(gulp.dest(config.buildDir));

  }));
});


gulp.task('listingApp', () => {
  let b = browserify({entries: config.js.listApp});
  return b
    .transform(babelify, {presets: ["es2015"], compact: false})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('index.js'))
    .pipe(gulp.dest(config.buildDir));
});

gulp.task('archiveApp', () => {
  let b = browserify({entries: config.js.archiveApp});
  return b
    .transform(babelify, {presets: ["es2015"], compact: false})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('archive.js'))
    .pipe(gulp.dest(config.buildDir));
});



gulp.task('auctionApp', () => {
  let b = browserify({entries: config.js.auctionApp});
  return b
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('auction.js'))
    .pipe(gulp.dest(config.buildDir));
});


gulp.task('build', ['all-js', 'css', 'png-images', 'icons', 'htmlPages', 'listingApp', 'archiveApp', 'auctionApp', 'fonts'], () => {

  let css = gulp.src(`${config.buildDir}/bundle.css`)
      .pipe(gulp.dest(config.outDir + '/static/css/'));

  let listPage = gulp.src(`${config.buildDir}/index.html`)
      .pipe(gulp.dest(config.outDir));

  let listApp = gulp.src(`${config.buildDir}/index.js`)
      .pipe(gulp.dest(config.outDir + '/static/'));

  let vendor_js = gulp.src(`${config.buildDir}/vendor.js`)
      .pipe(gulp.dest(config.outDir + '/static/'));

  let archivePage = gulp.src(`${config.buildDir}/archive.html`)
      .pipe(gulp.dest(config.outDir));

  let archiveApp = gulp.src(`${config.buildDir}/archive.js`)
      .pipe(gulp.dest(config.outDir + '/static/'));

  let auctionPage = gulp.src(`${config.buildDir}/tender.html`)
      .pipe(gulp.dest(config.outDir));

  let auctionApp = gulp.src(`${config.buildDir}/auction.js`)
      .pipe(gulp.dest(config.outDir + '/static/'));

  let png = gulp.src("build/*.png")
      .pipe(gulp.dest(config.outDir));

  let icons = gulp.src("build/img/*.png")
      .pipe(gulp.dest(config.outDir+'/img/'));


  let fonts = gulp.src("build/fonts/*")
      .pipe(gulp.dest(config.outDir+'/static/fonts/'));
 
  let fonts2 = gulp.src("build/fonts/*")
      .pipe(gulp.dest(config.outDir+'/fonts/'));


  return merge(css, png, fonts, listPage, listApp, vendor_js, auctionPage, auctionApp, fonts, fonts2, icons);
});


gulp.task('default', ['build']);

gulp.task('clean', function () {
  del.sync([config.buildDir + '*/**', config.outDir + '*/**'], {force: true});
});
