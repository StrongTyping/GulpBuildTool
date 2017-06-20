let [
	gulp,
	$,
	del,
	srcDir,
	tmpDir,
	vinylPaths
]  = [
	require('gulp'),
	require('gulp-load-plugins')(),
	require('del'),
	'app',
	'tmp',
	require('vinyl-paths')
];
let pkgPath 	= gulp.pkgPath;
let babelify 	= require('babelify');//babel  转换
let browserify 	= require("browserify");//es6 model 转换
let sourcemaps 	= require("gulp-sourcemaps");//源码地图
let source 		= require('vinyl-source-stream');//
let buffer 		= require('vinyl-buffer');//

let buildPath 	= {
	spriteall		: srcDir+'/sprites/*.png',//精灵图入口地址
	spriteimgname	: 'images/sprites.png',//精灵图保存合并后的img地址
	spritecssname	: 'styles/sprites.css'//精灵图保存合并后的css地址
}


/*
*Less编译
*/
gulp.task('less:build',() => {
	let pathsrc=[srcDir+'/**/*.less'];
	return gulp.src(pathsrc)
		.pipe($.less())
		.pipe(gulp.dest(pkgPath))
});

/**
*es6 import export transform
*/
gulp.task("browserify:build", () => {
    let bundler = browserify({
        entries		: 'app/scripts/babel/main.js',
        debug		: true,
		cache		: {},
		packageCache: {},
    });

	bundler.transform(babelify);

    return bundler.bundle()
        .pipe(source("scripts/bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(pkgPath));
});

/*
*资源压缩
*/
gulp.task('min:build', () => {
	return gulp.src(pkgPath+'/**/*')
		.pipe($.if('*.js',$.uglify({
			mangle			: false,//是否修改变量名
			compress		: true,//是否完全压缩
			preserveComments: 'license', //保留所有注释(all,license)
		})))
		.pipe($.if('*.css',$.autoprefixer({
			browsers		: ['last 4 Chrome versions','last 4 Safari versions','last 4 Explorer versions','Firefox >= 20','> 5%'],
            cascade			: false, //是否美化属性值 默认：true 类似缩进：
            remove			: false //是否去掉不必要的前缀 默认：true
		})))
		.pipe($.if('*.css',$.base64({
			// baseDir		: 'app/',
			extensions		: ['png', 'jpg', 'gif'],
			// exclude		:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
			maxImageSize	: 8 * 1024, // 8Kb以下的图片会被转换成base64
			debug			: false
		})))
		.pipe($.if('*.css',$.cleanCss({
			// debug				: true,
			// compatibility		: 'ie8',
			// advanced				: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            // compatibility		: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            // keepBreaks			: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments	: '*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
		}, (details) => {
			// console.log(details.name + ': ' + details.stats.originalSize);
            // console.log(details.name + ': ' + details.stats.minifiedSize);
		})))
		.pipe($.imagemin({
			// optimizationLevel	: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            // progressive			: true, //类型：Boolean 默认：false 无损压缩jpg图片
            // interlaced			: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            // multipass			: true //类型：Boolean 默认：false 多次优化svg直到完全优化
		}))
		.pipe($.if('*.html',$.htmlmin({
			collapseWhitespace				: true,//清除空格
			collapseBooleanAttributes		: false,//省略布尔属性值<input checked="checked"/>,设置这个属性后，就会变成 <input checked/>;
			removeComments					: true,//清除html中注释的部分
			removeEmptyAttributes			: false,//清除所有的空属性
			removeScriptTypeAttributes		: false,//清除所有script标签中的type="text/javascript"属性
			removeStyleLinkTypeAttributes	: false,//清楚所有Link标签上的type属性
			minifyJS						: true,//压缩html中的javascript代码
			minifyCSS						: true//压缩html中的css代码
		})))
		.pipe(gulp.dest(pkgPath))
});
/*
*对html页面上引入的css和js进行合并
*/
gulp.task('merge:build',() => {
	return gulp.src([pkgPath+'/**/*.html'])
		.pipe($.useref(), () => {
            return vinylPaths((paths) =>{
            	return del(paths,{force:true});
            })
        })
		.pipe(gulp.dest(pkgPath))
})
/*
*注入指定js脚本
*/
gulp.task('injecter:build',() => {
	return gulp.src([pkgPath+'/**/index.html'])
		.pipe($.cheerio(($) => {
			$('html').append('<script src="app.full.min.js"></script>');
		}))
		.pipe(gulp.dest(pkgPath))
})


/*
*资源hash
*/
gulp.task('hash:build', () => {
	return gulp.src(pkgPath+'/**/*.{jpg,gif,png,css,js}')
	    .pipe(vinylPaths((paths) => {
	    	return del(paths,{force:true});
	    }))
		.pipe($.rev())
		.pipe(gulp.dest(pkgPath))
		.pipe($.rev.manifest())
		.pipe(gulp.dest(tmpDir))

});

/*资源替换hash*/
gulp.task('hashref:build', ['hash:build'],() => {
	return gulp.src([tmpDir+'/**/*.json', pkgPath+'/**/*.{html,css,js}'])
		.pipe($.revCollector())
		.pipe(gulp.dest(pkgPath))
})

//编译阶段
gulp.task('compile:build',['less:build','sprite:common','babel:common','browserify:build','resource:common']);

//打包构建
gulp.task('build',$.sequence('clean:common','compile:build','merge:build','hashref:build','min:build'));
