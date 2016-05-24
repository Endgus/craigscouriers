var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglifyjs = require('gulp-uglifyjs');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var autoprefixer = require('gulp-autoprefixer');
var mainBowerFiles = require('main-bower-files'); // select from libs work main file
var googlecdn = require('gulp-google-cdn');
var cleanCSS = require('gulp-clean-css');

gulp.task('maincss', function() {
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('mainjs', function() {
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(gulp.dest('dist/libs'))
});

gulp.task('minify-css', function() {  // minify CSS
    return gulp.src('dist/styles/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('CDN', function () {
    return gulp.src('index.html')
        .pipe(googlecdn(require('./bower.json')))
        .pipe(gulp.dest('dist'));
});

gulp.task('library' ,function(){
    return gulp.src(['bower_components/jquery/dist/jquery.min.js'])//select array jquery...
        .pipe(concat('all-libs.min.js'))
        .pipe(uglifyjs())// min js
        .pipe(gulp.dest('dist/libs'));
});

gulp.task('sass', function(){
    return gulp.src('app/style/my_style.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 5 versions']))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('browser-sync', function(){
    browserSync({
        server:{baseDir: 'dist'}
    });
});

gulp.task('img', function(){
    return gulp.src('app/images/**/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox:false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('watch',['browser-sync', 'sass', 'img'], function(){ // ['browser-sync', 'sass'] - start before WATCH
    gulp.watch('app/style/*.scss', ['sass']);
    gulp.watch('dist/*.html', browserSync.reload); // reload .html file (You can also add .js file ets..)
});
