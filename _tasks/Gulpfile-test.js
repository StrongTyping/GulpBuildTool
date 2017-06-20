let gulp = require('gulp'),
	$ = require('gulp-load-plugins')();

let srcDir='app';
let tmpDir='tmp';
let pkgPath=gulp.pkgPath;

let buildPath={
	spriteall		:srcDir+'/sprite/*.png',//精灵图入口地址
	spriteimgname	:'images/sprite.png',//精灵图保存合并后的img地址
	spritecssname	:'styles/sprite.css'//精灵图保存合并后的css地址
}


/*
*Less编译
*/
gulp.task('less:test',() => {
	let pathsrc=[srcDir+'/**/*.less'];
	return gulp.src(pathsrc)
		.pipe($.less())
		.pipe(gulp.dest(pkgPath))
});
/*
*sass编译
*/
gulp.task('sass:test',() => {
	let pathsrc=[srcDir+'/**/*.{scss,sass}'];
	return gulp.src(pathsrc)
		.pipe($.sass({
			outputStyle: 'compressed'//压缩
		}).on('error',$.sass.logError))
		.pipe(gulp.dest(pkgPath))
})


/*
*js路径替换
*/
gulp.task('cdn:test', () => {
	let pathsrc=[srcDir+'/bower/*.json', pkgPath+'/**/*.html'];
	return gulp.src(pathsrc)
		.pipe($.revCollector())
		.pipe(gulp.dest(pkgPath))
});

/*
*检测JS语法
*/
gulp.task('jslint:test', () => {
	return gulp.src(pkgPath+'/**/*.js')
		//.pipe(jscs())   //检测JS风格
		.pipe($.jshint({
			"undef"	: false,
			"unused": false
		}))
		//.pipe($.jshint.reporter('default'))  //错误默认提示
		.pipe($.jshint.reporter($.stylish)) //高亮提示
		.pipe($.jshint.reporter('fail'));
});
/*
*检测CSS语法
*/
gulp.task('csslint:test',() => {
	return gulp.src(pkgPath+'/**/*.css')
		.pipe($.csslint())
		.pipe($.csslint.formatter())
})

//编译阶段
gulp.task('compile:test',['less:test','sprite:common','resource:common']);

//开发打包构建
gulp.task('test',$.sequence('clean:common','compile:test','cdn:test','jslint:test','csslint:test'));
