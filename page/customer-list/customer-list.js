
define("page/customer-list/customer-list", function(require, exports, module){


    module.exports = function(opt) {
        
        
        /**
         * 初始化右上角筛选 menu
         */
        (function initMenu() {
    
            var $ = require('zepto');
            require('libs/zepto.modal');
    
            // 展开右上角的下拉菜单 "筛选"
            $(".filter-menu").on("click",(function(){
    
                var modal;
    
                return function() {
    
                    modal = modal || $.modal({
                        '$cont': $( __inline('./filter-menu.tmpl')() ),
                        isTouchHide: true
                    });
    
                    modal.show();
                }
            })());
    
        })();
        
        
        
        

        var $ = require('zepto'),
            ScrollLoad = require('libs/zepto.scrollload'),
            
            tplFn = __inline('./customer-list.tmpl'),
            emptyFn = __inline('./empty.tmpl'),
        
            EMUN_CUR_STATUS = {
                '-1': '全部',
                '1': '审核中',
                '2':'退回补件',
                '3':'审核拒绝',
                '4':'审核通过',
                '5':'提交资料',
                '7':'等待签约',
                '10':'放款审批中',//签约完成/等待审批
                '15':'放款审批完成',
                '17':'放款失败',
                '20':'已放款'
            },
            EMUN_FOLLOWRECORD = {
                '0':'无',
                "1": "电话未打通",
                "2": "暂时不方便",
                "3": "已购车",
                "4": "主动放弃",
                "5": "上外地牌",
                "6": "符合准入条件",
                "7": "其他",
                "8": "已确认购车",
                "9": "已推荐车商",
                "10": "看车中",
                "11": "等待指标中"
            },
            // helper
            reverseMap = function(map) {
                var rtn = {};
                var key;
                for(key in map) {
                    rtn[map[key]] = key;
                }
                return rtn;
            },
            // callback
            onSuccess = function(obj) {
                
                if ( obj && obj.rows && obj.rows.length ) {
                    obj.rows.forEach(function(item){
                        item.cur_status_str = EMUN_CUR_STATUS[item.cur_status];
                        item.followRecord_str = EMUN_FOLLOWRECORD[item.followRecord];
                    });
                    
                    var $new = $( tplFn(obj) );
                    $('#list-wrap').append($new);
                    
                } else {
                    sl.destroy();
                    // 判断 暂无记录 还是 无更多记录
                    $('#list-wrap').append( $(emptyFn({ type: obj.total ? 'nomore' : 'empty' })) );
                }
            
            };
            
        
        
        var sl = new ScrollLoad();
        
        
        // 初始化加载
        (function() {
            sl.init({
                url: '/market/customer/list/data',
                rows: 20,
                onSuccess: onSuccess
            });
            sl.start();
        })();

        
        // 按名字搜索
        $('.search-btn').click(function(){
            
            var username = $('.search-input').val();
            $('#list-wrap').empty();
            
            sl.reinit({
                url: '/market/customer/list/data',
                rows: 20,
                username: username,
                onSuccess: onSuccess
            });
            sl.start();
        });
        
        
        // 按状态筛选
        $(document).on('click', '.modal-mask .filter-option', function(){

            $(this).addClass("active").parents("section").find(".filter-option").not(this).removeClass("active");
            var statusStr = $(this).text();
            var status = reverseMap(EMUN_CUR_STATUS)[statusStr];
            $('#list-wrap').empty();
            
            sl.reinit({
                url: '/market/customer/list/data',
                rows: 20,
                status: status,
                onSuccess: onSuccess
            });
            sl.start();
        });

        $(".search-input").change(function(){
            var v = $(this).val(),
                $searchBtn = $(".search-btn");

            v != "" ? $searchBtn.addClass("active"): $searchBtn.removeClass("active");
        });
    };
});

