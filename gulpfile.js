// Incluir os módulos

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync'),
    //Agrupa os arquivos para realizar o build
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    //Realiza otimização das imagens
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    //Deletar arquivos para reconstruir o build
    del = require('del'),
    //executa as tarefas em ordem para construção do build
    runSequence = require('run-sequence')


//Configurar o Sass
gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream())
})

// Configurar Browser Sync
gulp.task('browserSync', function () {
    const files = [
        './src/css/app.css',
        './src/js/**/*.js',
        './src/**/*.html'
    ];
    //subir o server do Browser Sync
    browserSync.init(files, {
        server: {
            baseDir: 'src'
        },
    })
})

//Realizar o Build do pacote
gulp.task('useref', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        // Minifica apenas se for um arquivo JavaScript
        .pipe(gulpIf('*.js', uglify()))
        // Minifica apenas se for um arquivo CSS
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
})

//Otimização de Imagens
gulp.task('images', function () {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        // .pipe(cache - Realiza o cache das imagens
        .pipe(cache(imagemin({
            // imagens entrelaçadas
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
})


//Tarefa do Watch
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch("src/scss/**/*.scss", ['sass'])
})

//Executar tarefas de Desenvolvimento
gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
})


//Deletar arquivos para reconstruir o build
gulp.task('build:clean', function () {
    return del.sync('dist');
})

//Executar o Build
gulp.task('build', function (callback) {
    runSequence('build:clean',
        ['sass', 'useref', 'images'],
        callback
    )
})