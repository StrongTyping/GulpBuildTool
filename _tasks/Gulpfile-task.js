let gulp 	= require('gulp'),
	$ 		= require('gulp-load-plugins')();


let pkgPath = gulp.pkgPath;
let srcDir 	= 'app';
let tmpDir 	= 'tmp';//hash json 目录

let buildPath 	= {
	spriteall		: srcDir+'/sprites/*.png',//精灵图入口地址
	spriteimgname	: 'images/sprites.png',//精灵图保存合并后的img地址
	spritecssname	: 'styles/sprites.css'//精灵图保存合并后的css地址
}

/*
*指定文件拷贝
*/
gulp.task('resource:common', () => {
	let pathsrc = [
		srcDir + '/**/*.{otf,eot,svg,ttf,woff,woff2}',
		srcDir + '/**/*.json',
		srcDir + '/**/*.{jpg,gif,png}',
		srcDir + '/**/*.js',
		srcDir + '/**/*.css',
		srcDir + '/**/*.html',
		'!' + srcDir + '/bower/**/*',
		'!' + buildPath.spriteall
	];
	return gulp.src(pathsrc).pipe(gulp.dest(pkgPath))
})

/*
*babel
*/
gulp.task('babel:common',() => {
	return gulp.src(srcDir + '/**/*.es6')
		.pipe($.plumber())
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(srcDir))
})
/*
*清除dist目录
*/
gulp.task('clean:common',() =>{
    return gulp.src([pkgPath,tmpDir],{read:false})
    	.pipe($.clean({force:true}));
});

//Sprite图片
gulp.task('sprite:common', () => {
	return gulp.src(buildPath.spriteall) //需要合并的图片地址
		.pipe($.spritesmith({
			imgName      : buildPath.spriteimgname, //保存合并后图片的地址
			cssName      : buildPath.spritecssname, //保存合并后对于css样式的地址
			algorithm    : 'binary-tree', //图片排列值(top-down,left-right,diagonal,alt-diagonal,binary-tree)
			padding      : 5, //合并时两个图片的间距
			cssTemplate  : (data) => { //生成css的模板文件
				let arr = [];
				data.sprites.forEach((sprite) => {
					arr.push(".icon-" + sprite.name +
						"{" +
						"background-image: url('" + sprite.escaped_image + "');" +
						"background-position: " + sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
						"width:" + sprite.px.width + ";" +
						"height:" + sprite.px.height + ";" +
						"}\n");
				});
				return arr.join("");
			}
		}))
		.pipe(gulp.dest(pkgPath));
});
