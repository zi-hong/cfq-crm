/**
 * README
 * 
 * 安装jr58
 * npm install jr58 -g
 * 
 * 编译到本地tomcat
 * jr58 release -cDw
 * 或者
 * jello release -cDw
 * 
 * 编译给Javaer (请先安装jr58，暂不支持jello命令)
 * jr58 release -comDd ../out-your-path publish
 */



var IS_PUBLISH = /publish/.test(process.title);
console.log('IS_PUBLISH:' + IS_PUBLISH)


var domainCDN = {
    "/static/img/contract/*.png": ["http://j1.58cdn.com.cn/jinrong/chedai/contract"]
};


// cdn判断
if( ! /D[^:]/.test(process.title) ) {
    throw 'Contract module use CDN, please add param -D';
}


//// --------------------------------
//// autuload, 依赖自动加载
//// --------------------------------
//// fis.config.set('modules.postpackager', 'autoload');
//// fis.config.set('settings.postpackager.autoload.type', 'requirejs');







//// --------------------------------
//// 支持 amd 设置
//// --------------------------------
////fis.config.set('modules.postprocessor.vm', 'amd');
////fis.config.set('modules.postprocessor.js', 'amd');
////fis.config.set('modules.postprocessor.jsp', 'amd');
////fis.config.set('settings.postprocessor.amd', {
////  packages: [
////      // 用来存放 libs 库
////      {
////          name: 'libs',
////          location: 'static/libs/',
////          main: 'index'
////      }
////  ]
////});


// --------------------------------
// vm内路径转换插件
// --------------------------------
if(IS_PUBLISH)

fis.config.merge({
    modules: {
        preprocessor: {
            useCache: false,
            vm: 'replace58',
            html: 'replace58'
        }
    } ,
    settings: {
        preprocessor: {
            replace58: {
                _views: IS_PUBLISH ? '/views/crm-m' : '',
                temp_ext: IS_PUBLISH ? 'html' : 'vm'
            }
        }
    }
})







// --------------------------------
// 压缩优化
// --------------------------------
fis.config.merge({
    modules: {
        optimizer : {
            // js后缀文件会经过fis-optimizer-uglify-js插件的压缩优化
            js : 'uglify-js', css : 'clean-css' //, png : 'png-compressor'
        }
    },
    // 使用pngquant进行压缩，png图片压缩后均为png8
    // fis.config.set('settings.optimizer.png-compressor.type', 'pngquant');
    settings: {
        optimizer : {
            'png-compressor' : {
                type : 'pngquant'
            }
        }
    },
    
    deploy: {
        publish: {
            // jello release -ompDd publish
            to: '../output-CRM-And-PC-BMS'
        }
    }
});








//// --------------------------------
//// 打包配置
//// --------------------------------
//// 使用 depscombine 是因为，在配置 pack 的时候，命中的文件其依赖也会打包进来。
////fis.config.set('modules.packager', 'depscombine');
////
////fis.config.set('pack', {
////  // css
////  'pkg/frame.css': ['page/layout/frame.vm'],   // 因为依赖会被打包，所以这个规则会把 frame.vm 依赖的 css 打包在一起。
////  // js
////  // 依赖也会自动打包进来。
////  'pkg/boot.js': ['static/js/require.js', 'components/zepto_1.1.6/zepto.js']
////  //'pkg/app.js': ['page/examples/form.js']
////});
//
//
//
//
//
//
//
if( IS_PUBLISH )
// ----------------------
// 发布给后端
// ----------------------

fis.config.set('roadmap', {
    
    domain: domainCDN,

    ext: {vm: 'html', scss: 'css'},
    
    path: [

        /* 模板 */ 
        {
            reg: '**.tmpl',
            release: false,
            isJsLike : true
        },
        
        /* 模拟数据 */
        {
            reg: /^\/test\/.*/i,
            release: false,
            useMap: false
        },
        
        /* demo */ 
        {
            reg: /^\/demo\/.*/,
            release: false,
            useMap: false
        },
        
        /* 废弃 */ 
        {
            reg: /^\/static\/decraped\/.*/i,
            release: false,
            useMap: false
        },
        
        /* demo图片 */ 
        {
            reg: /^\/static\/img\/example\/(.*)/,
            release: '/resources/crm-m/static/img/example/$1',
            useHash: false
        },

        // 此处放到CDN->chedai->contract文件加下，见上方domain配置
        // CDN路径：http://j1.58cdn.com.cn/jinrong/chedai/contract/seal-58.png
        {
            reg: /^\/static\/img\/contract\/(.*)/i,
            useHash: false,
            url: '/$1',
            release: IS_PUBLISH ? 'resources/crm-m/static/img/contract/$1' : false
        },
        
        
        /* 所有static资源 */
        {
            reg: /^\/static\/(.*)/i,
            url: '/crm-m/static/$1',
            release: '/resources/crm-m/static/$1'
        },
        
        // 务必保证次序
        {
            reg: /^\/(page|widget)\/(.+)\.vm$/i,
            release: '/views/crm-m/$1/$2.html',
            isViews: true
        },
        
        {
            reg: /^\/(page|widget)\/(.+)$/i,
            url: '/crm-m/static/$1/$2',
            release: '/resources/crm-m/static/$1/$2'
        }
        
    ]
})





else 
// ----------------------
// 发布给tomcat
// ----------------------
fis.config.set('roadmap', {

    domain: domainCDN,

    ext: {vm: 'vm', scss: 'css'},
    
    path: [
        
        /* 模板 */ 
        {
            reg: '**.tmpl',
            release: false,
            isJsLike : true,
            useOptimizer: false
        },
        
        /* demo图片 */ 
        {
            reg: /^\/static\/img\/example\/.*/,
            useHash: false
        },
        
        /* 废弃 */ 
        {
            reg: /^\/static\/decraped\/.*/i,
            release: false,
            useMap: false
        },

        // 此处放到CDN->chedai->contract文件加下，见上方domain配置
        // CDN路径：http://j1.58cdn.com.cn/jinrong/chedai/contract/seal-58.png
        {
            reg: /^\/static\/img\/contract\/(.*)/i,
            useHash: false,
            url: '/$1',
            release: ''
        },
        
        {
            reg: /^\/(page|widget|demo)\/(.+)\.vm$/i,
            release: 'WEB-INF/views/$1/$2.vm',
            isViews: true
        }
        
        // 2015-12-29 jiajianrong
        // 貌似今天我的工程木有问题了，不加isMod false也不会自动define包装
        // 2015-12-30
        // 其实是因为page文件夹下的js文件在define语句之前加了注释，造成二次包装
//      {
//          reg: /^\/(page|widget)\/(.+)\.js$/i,
//          isMod: false,
//          url: '/static/$1/$2.js',
//          release: '/static/$1/$2.js'
//      }
        
        
    ].concat(fis.config.get('roadmap.path', []))
})








// js 模板支持
fis.config.set('modules.parser.tmpl', 'utc');
////fis.config.set('roadmap.ext.tmpl', 'js');
////fis.config.set('roadmap.ext.tpl', 'js');
////fis.config.merge({
////  settings: {
////      parser : {
////          'utc': {
////              variable: 'obj'
////          }
////      }
////  }
////});
//
//
















//postpackager插件接受4个参数，
//ret包含了所有项目资源以及资源表、依赖树，其中包括：
//   ret.src: 所有项目文件对象
//   ret.pkg: 所有项目打包生成的额外文件
//   reg.map: 资源表结构化数据
//其他参数暂时不用管
var createFrameworkConfig = function(ret, conf, settings, opt){
    
    var allRes = [];
    
    

    fis.util.map(ret.map.res, function(fileName, fileDetails){
        var obj = {};
        
        obj.fileName = fileName;
        obj.fileUri = fileDetails.uri;
        obj.deps = fileDetails.deps;
        
        allRes.push(obj);
    });
    
    
    /**
     * allRes: array
     * 
        0: Object
        deps: Array[9]
        fileName: "page/car-apply/car-apply.js"
        fileUri: "/crm-m/static/page/car-apply/car-apply_4e6788d.js"
        
        1: Object
        deps: undefined
        fileName: "page/car-apply/car-apply.scss"
        fileUri: "/crm-m/static/page/car-apply/car-apply_9101db8.css"
        
        ...
     */
    
    // var stringify = JSON.stringify(all);
    
    
    
    
    function digui(jsName, allRes, rtnRes) {
        
        allRes.forEach(function(item){
            
            if( item.fileName && item.fileName.indexOf(jsName) != -1 ) {
                
                var obj = {};
                
                obj.deps = item.deps || [];
                obj.fileUri = item.fileUri;
                
                obj.deps && obj.deps.length && obj.deps.forEach(function(item){
                    digui( item+".js", allRes, rtnRes );
                });
                
                // 一定保证digui调用在本句前面，依赖提前加载
                rtnRes.push(obj);
                
                return false;
            }
            
        });
    }
    
    
    function quchong(arr) {
        var rtnArr = [],
            tmpMap = {},
            itemUri;
        for( var i=0; i<arr.length; i++ ) {
            itemUri = arr[i].fileUri;
            
            // 靠fileUri做map key值去重
            if ( !tmpMap[itemUri] ) {
                tmpMap[itemUri] = true;
                rtnArr.push(arr[i]);
            }
        }
        return rtnArr;
    }

    
    
    //再次遍历文件，找到isViews标记的文件
    //替换里面的__FRAMEWORK_CONFIG__钩子
    fis.util.map(ret.src, function(subpath, file){
        //有isViews标记，并且是js或者html类文件，才需要做替换
        if(file.isViews && (file.isJsLike || file.isHtmlLike)){
            
            // 当前view对应的js文件
            var jsName = file.id.replace(/\.vm/,'.js');
            
            // 为数组以保证依赖顺序
            var rtnRes = [];
            
            digui(jsName, allRes, rtnRes);
            
            
            rtnRes = quchong(rtnRes);
            
            
            var tmpRes = rtnRes.map(function(item){
                return item.fileUri;
            });
            //console.log("\n\n" + jsName + " --requires--\n" + tmpRes.join("\n"));
            
            
            
            var stringify = "";
            
            rtnRes.forEach(function(item){
                stringify += "<script src='" + item.fileUri + "'></script>";
            })
            
            var content = file.getContent();
            
            //替换文件内容
            content = content.replace(/\b__FRAMEWORK_CONFIG__\b/g, stringify);
            file.setContent(content);
        }
    });
    
    
};


//在modules.postpackager阶段处理依赖树，调用插件函数
fis.config.set('modules.postpackager', [createFrameworkConfig]);

