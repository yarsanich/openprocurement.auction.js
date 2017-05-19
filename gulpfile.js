const gulp          = require('gulp'),
      notify        = require('gulp-notify'),
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
      merge         = require('merge-stream');

function  interceptErrors(error) {
  let args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}

const buildDir = 'build/';
const outDir = '_attachments/';


const sources = {
  styles: ['src/assets/css/starter-template.css', 'src/lib/angular-growl-2/build/angular-growl.min.css'],
  fonts: 'src/assets/fonts/*',
  html: [
    {name: 'index', scripts: ["index.js"], title: "Auction Software"},
    {name: 'archive', scripts: ["archive.js"], title: "Auction Software"},
    {name: 'tender', scripts: ["auction.js"], title: "Auction Software"},
  ],
  js: {
    listApp: 'src/app/index.js',
    archiveApp: 'src/app/archive.js',
    auctionApp: 'src/app/auction.js',
  },
  img: {
    png: 'src/assets/img/*.png',
    icons: 'src/assets/img/img/*.png'
  }
};



gulp.task('fonts', () => {
  return gulp.src(sources.fonts)
    .on('error', interceptErrors)
    .pipe(gulp.dest(buildDir+'/fonts/'));
});


gulp.task('png-images', () => {
  return gulp.src(sources.img.png)
    .on('error', interceptErrors)
    .pipe(gulp.dest(buildDir));
});


gulp.task('icons', () => {
  return gulp.src(sources.img.icons)
    .on('error', interceptErrors)
    .pipe(gulp.dest(buildDir+'/img/'));
});


gulp.task('bower-main', () => {
  return allJs = gulp.src('./bower.json')
      .pipe(vendorFiles({
        base: "src/lib",}))
      .pipe(gulpFilter(['**/*.js']))
      .pipe(gulp.dest(buildDir + '/vendor/'));
});


gulp.task('all-js', ['bower-main'], () => {
  return gulp.src([
    buildDir + '/vendor/**/*.js',
    './src/lib/moment/locale/uk.js',
    './src/lib/moment/locale/ru.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(buildDir));
});


gulp.task('css', () => {
  return gulp.src(sources.styles)
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS())
    .on('error', interceptErrors)
    .pipe(gulp.dest(buildDir));
});

gulp.task('htmlPages', () => {
  return merge(sources.html.map((page) => {
    return gulp.src('./templates/base.html')
    .pipe(fileinclude({
      prefix: '@@',
      indent: true,
      context: {title: page.title, name: page.name, scripts: page.scripts}}))
    .on('error', interceptErrors)
    .pipe(rename(page.name +'.html'))
    .pipe(gulp.dest(buildDir));

  }));
});


gulp.task('listingApp', () => {
  let b = browserify({entries: sources.js.listApp});
  return b
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('index.js'))
    .pipe(gulp.dest(buildDir));

});

gulp.task('archiveApp', () => {
  let b = browserify({entries: sources.js.archiveApp});
  return b
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('archive.js'))
    .pipe(gulp.dest(buildDir));
});



gulp.task('auctionApp', () => {
  let b = browserify({entries: sources.js.auctionApp});
  return b
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('auction.js'))
    .pipe(gulp.dest(buildDir));
});


gulp.task('build', ['all-js', 'css', 'png-images', 'icons', 'htmlPages', 'listingApp', 'archiveApp', 'auctionApp', 'fonts'], () => {

  let css = gulp.src(`${buildDir}/bundle.css`)
      .pipe(gulp.dest(outDir + '/css/'));

  let listPage = gulp.src(`${buildDir}/index.html`)
      .pipe(gulp.dest(outDir));

  let listApp = gulp.src(`${buildDir}/index.js`)
      .pipe(gulp.dest(outDir));

  let vendor_js = gulp.src(`${buildDir}/vendor.js`)
      .pipe(gulp.dest(outDir));

  let archivePage = gulp.src(`${buildDir}/archive.html`)
      .pipe(gulp.dest(outDir));

  let archiveApp = gulp.src(`${buildDir}/archive.js`)
      .pipe(gulp.dest(outDir));

  let auctionPage = gulp.src(`${buildDir}/tender.html`)
      .pipe(gulp.dest(outDir));

  let auctionApp = gulp.src(`${buildDir}/auction.js`)
      .pipe(gulp.dest(outDir));

  let png = gulp.src("build/*.png")
      .pipe(gulp.dest(outDir));

  let icons = gulp.src("build/img/*.png")
      .pipe(gulp.dest(outDir+'/img/'));


  let fonts = gulp.src("build/fonts/*")
      .pipe(gulp.dest(outDir+'/static/fonts/'));
 
  let fonts2 = gulp.src("build/fonts/*")
      .pipe(gulp.dest(outDir+'/fonts/'));


  return merge(css, png, fonts, listPage, listApp, vendor_js, auctionPage, auctionApp, fonts, fonts2, icons);
});


