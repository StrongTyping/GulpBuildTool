let [
	gulp,
	$,
	proxy,
	srcDir,
	tmpDir,

	babelify,
	browserify,
	sourcemaps,
	source,
	buffer,
	watchify
] = [
	require('gulp'),//gulp core
	require('gulp-load-plugins')(),//gulp load plugins
	require('http-proxy-middleware'),//代理中间件
	'app',//开发目录
	'tmp',//hash json 目录

	require('babelify'),//babel  转换
	require("browserify"),//es6 model 转换
	require("gulp-sourcemaps"),//源码地图
	require('vinyl-source-stream'),//
	require('vinyl-buffer'),//
	require('watchify')//监听流
]
let pkgPath 	= gulp.pkgPath;
let buildPath 	= {
	spriteall		: srcDir+'/sprites/*.png',//精灵图入口地址
	spriteimgname	: 'images/sprites.png',//精灵图保存合并后的img地址
	spritecssname	: 'styles/sprites.css'//精灵图保存合并后的css地址
}
/*
*指定文件拷贝
*/
gulp.task('resource:dev', () => {
	let pathsrc = [
		srcDir+'/**/*.{otf,eot,svg,ttf,woff,woff2}',
		srcDir+'/**/*.json',
		srcDir+'/**/*.{jpg,gif,png}',
		srcDir+'/**/*.js',
		srcDir+'/**/*.css',
		srcDir+'/**/*.html',
		'!'+buildPath.spriteall
	];
	return gulp.src(pathsrc).pipe(gulp.dest(pkgPath))
})

/*
*Less编译
*/
gulp.task('less:dev', () => {
	return gulp.src(srcDir+'/**/*.less')
		.pipe($.plumber({
			errorHandler: $.notify.onError('Error: <%= error.message %>')
		}))
		.pipe($.less())
		.pipe($.autoprefixer({
			browsers		: ['last 4 Chrome versions','last 4 Safari versions','last 4 Explorer versions','Firefox >= 20','> 5%'],
            cascade			: false, //是否美化属性值 默认：true 类似缩进：
            remove			: false //是否去掉不必要的前缀 默认：true
		}))
		.pipe(gulp.dest(pkgPath))
});
/*
*sass编译
*/
gulp.task('sass:dev', () => {
	return gulp.src(srcDir+'/**/*.{scss,sass}')
		.pipe($.sass({
			outputStyle: 'compressed'//压缩
		}).on('error',$.sass.logError))
		.pipe(gulp.dest(pkgPath))
})

/**
*es6 import export transform
*/
gulp.task("browserify:dev", () => {
    let bundler = browserify({
        entries		: 'app/scripts/babel/main.js',
        debug		: true,
		cache		: {},
		packageCache: {},
		plugin		: [watchify]
    });

	bundler.transform(babelify);
	bundler.plugin(watchify);

    return bundler.bundle()
        .pipe(source("scripts/bundle.js"))
        .pipe(buffer())
        // .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(pkgPath));
});
/*
*Sprite图片
*/
gulp.task('sprite:dev', () => {
	return gulp.src(buildPath.spriteall) //需要合并的图片地址
		.pipe($.spritesmith({
			imgName		: buildPath.spriteimgname, //保存合并后图片的地址
			cssName		: buildPath.spritecssname, //保存合并后对于css样式的地址
			algorithm	: 'binary-tree', //图片排列值(top-down,left-right,diagonal,alt-diagonal,binary-tree)
			padding		: 5, //合并时两个图片的间距
			cssTemplate	: (data) => { //生成css的模板文件
				let arr = [];
				data.sprites.forEach((sprite) => {
					arr.push(
						".icon_" + sprite.name +
						"{" +
						"background-image: url('" + sprite.escaped_image + "');" +
						"background-position: " + sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
						"width:" + sprite.px.width + ";" +
						"height:" + sprite.px.height + ";" +
						"}\n"
					);
				});
				return arr.join("");
			}
		}))
		.pipe(gulp.dest(pkgPath));
});

gulp.task('connect:dev', () => {
	$.connect.server({
		livereload			: true,//开启刷新
		root				: "dist",//监听目录
		port				: 8001,//端口
		directoryListing	: true,//文件目录
		middleware			: (connect,opt) => {
			return [
				proxy(['/mall/gm/api/**/*'],{
					target: 'http://xinluke.eicp.net:20000',
					changeOrigin: true,
					onProxyReq:function onProxyReq(proxyReq, req, res) {
						// add custom header to request
						proxyReq.setHeader('host', req.headers.host);
						// or log the req
					},
					logLevel:'info',//['debug', 'info', 'warn', 'error', 'silent']. Default: 'info'
					// logProvider:function(provider){
					// 	return require('winston')
					// }
				})
			]
		}
	})
})

/*
*监听所有文件发生改变时静态文本服务器刷新
*/
gulp.task('livereload:dev', () => {

	return gulp.src('./app/**/*')
		// .pipe($.debug({title: 'unicorn:'}))
		.pipe($.connect.reload());
});
//增量编译
gulp.task('incremental:dev', () => {
	return gulp.src([
		'app/**/*',
		'!app/**/*.{less,scss,es6}',
	])
		.pipe($.changed(pkgPath))
		.pipe(gulp.dest(pkgPath));
})
//任务监听
gulp.task('watch:dev', () => {
	gulp.watch('app/**/*.{less,scss}', ['less:dev']);
	gulp.watch('app/**/*.es6', ['babel:common','browserify:dev']);
	gulp.watch('app/sprites/*.png', ['sprite:common']);
	gulp.watch('app/**/*',['incremental:dev','livereload:dev']);
});


//编译阶段
gulp.task('compile:dev',$.sequence('less:dev','sprite:common','resource:common','babel:common','browserify:dev','connect:dev'));

//开发打包构建
gulp.task('dev',$.sequence('clean:common','watch:dev','compile:dev'));
