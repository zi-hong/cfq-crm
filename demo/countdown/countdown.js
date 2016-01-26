
define("demo/countdown/countdown", function(require, exports, module){

    module.exports = function(opt) {
        
        require('libs/zepto.countdown');
        
        var $ = require('zepto'),
            $clickBtn1 = $('.clickBtn1'),
            $clickBtn2 = $('.clickBtn2');
            
        /*
        * 样式1
        * <p class="xxxxx">23天12时3分2秒</p>
        * $('.xxxxx').countdown();
        */
        $clickBtn1.countdown();
        
        

        /*
        * 样式2
        * <p class="xxxxx"></p>
        * $('.xxxxx').countdown({last:'30秒', finishTxt:'done', tickTxt:"请在{0}秒后重新获取"});
        */
        $clickBtn2.click(function(){

            if ( $clickBtn2.hasClass('disabled') ) {
                return false;
            }

            $clickBtn2.countdown({
                last: '59秒',
                finishTxt: '重新获取',
                tickTxt: '请在{0}后重新获取',
                onStart: function(){
                    $clickBtn2.removeClass('clickBtn').addClass('unclickBtn disabled');
                },
                onFinish: function(){
                    $clickBtn2.removeClass('unclickBtn disabled').addClass('clickBtn');
                }
            });
        });
        
    };
});

