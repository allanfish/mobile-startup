var ignores = fis.get("project.ignore");
ignores = ignores.concat(['design/**', 'publish/**', 'dest/**', '_/**']);
fis.set('project.ignore', ignores);
fis.set('project.watch.usePolling', true);

fis.hook('module', {
    mode: 'mod'
});
fis.hook('relative');

/*************************目录规范*****************************/
fis.match('*', {
    relative: true,
    _isResourceMap: false
}).match(/.*\.(html|jsp|tpl|vm|htm|asp|aspx|php)$/, { //页面模板不用编译缓存
    useCache: false
}).match(/.*\.(css|less)/, {
    //useHash: true,
    //useSprite: true,
    //optimizer: fis.plugin('clean-css')
}).match('*.less', {
    rExt: '.css', // from .scss to .css
    useSprite: true,
    parser: fis.plugin('less', {
        //fis-parser-less option
    })
}).match('/css/mixins/**.less', {//less的mixin文件无需发布
    release: false
}).match('/*', {release: false});

fis.media('dev').match('*', {
    deploy: fis.plugin('local-deliver', {
        to: './publish'
    })
});

/************************test******************************/

fis.media("test").match("*", {
    deploy: fis.plugin('http-push', {
        receiver: 'http://ued.wsd.com/receiver/receiver2.php',
        to: '/data/wapstatic/allanyu/allinone11' // 注意这个是指的是测试机器的路径，而非本地机器
    })
});

/**************prod***************/

//使用方法 fis3 release prod
fis.media('prod')
    .match('*.{css,less}', {
        optimizer: fis.plugin('clean-css'),
        useSprite: true
    }).match("lib/mod.js", {
        packTo: "/pkg/vendor.js"
    }).match("bower_components/**/*.js", { //所有页面中引用到的bower js资源
        packTo: "${pub}/pkg/vendor.js"
    }).match('*.css', {
        optimizer: fis.plugin('clean-css')
    }).match('*.js', {
        optimizer: fis.plugin('uglify-js')
    }).match('*.min.js', {
        optimizer: null
    });

/**********************生产环境下CSS、JS压缩合并*****************/
fis.media('prod').match('::packager', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true // 资源映射表内嵌
    }),
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites', {
        layout: 'matrix',
        margin: '15',
        scale: 0.5
    })
});

