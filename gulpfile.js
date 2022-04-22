const gulp = require('gulp');
const {parallel, src, dest, watch} = require( 'gulp' );
const sass = require( 'gulp-sass' )(require( 'sass' ));
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const cache = require('gulp-cache');
const htmlmin = require('gulp-htmlmin');

// añadiendo rutas:
const paths = {
  srcImg: 'src/img/**/*',
  destImg: './build/img',
  srcScss: 'src/scss/**/*.scss',
  destScss: './build/css',
  srcJs: 'src/js/**/*.js',
  destJs: './build/js',
}

// funcion que compila sass
function compileSASS(){
  return src(paths.srcScss)
    .pipe(sourcemaps.init())
    .pipe( sass({}) )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe( dest(paths.destScss) )
}

// funcion para js
function js(){
  return src(paths.srcJs)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest(paths.destJs))
}

// funcion que minifica el tamaño de las imagenes
function minImg(){
  	return src(paths.srcImg)
		.pipe(cache(imagemin({ optimizationLevel: 3})))
		.pipe(dest(paths.destImg))
}

// funcion que agrega el formato webp
function webpImg(){
  	return src(paths.srcImg)
    .pipe(webp())
		.pipe(dest(paths.destImg))
}

// funcion que escucha todos los cambios y luego compila sass y js
function listenChanges(){
  watch(paths.srcScss, compileSASS)
  watch(paths.srcJs, js)
	watch( paths.srcImg, minImg );
  watch( paths.srcImg, webpImg );
}

exports.default = parallel(compileSASS, js, minImg, webpImg, listenChanges);