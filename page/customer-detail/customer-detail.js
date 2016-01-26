define("page/customer-detail/customer-detail", function(require, exports, module){
    
    /**
     * 初始化右上角menu
     */
    (function initMenu() {
        
        var $ = require('zepto');
        require('libs/zepto.modal');
        
        // 展开右上角的下拉菜单
        $(".mark-menu").on("click",(function(){
            
            var modal;
            
            return function() {
                
                modal = modal || $.modal({
                    '$cont': $( __inline('./action-menu.tmpl')() ),
                    isTouchHide: true
                });
                
                modal.show();
            }
        })());
        
    })();
    
    
    
    
    module.exports = function(opt) {
    
        var $ = require('zepto');
        
        require('libs/zepto.info');
        
        require('libs/zepto.form');
    
        var $form = $("#form");
        
        
        $(".follow").on("click", ".follow-item", function(e){
            var $this = $(this);
            $form.find(".follow-record").val( $this.prop('id') );
            $form.find(".follow-item").removeClass("active");
            $this.addClass("active");
        });
        
        
        $(".btn-submit").on("click",function(e){
            
            var $this = $(this),
                result = $form.form('validate');

            if ( !result.isValid ) {
                var str = '';

                for(var i in result.messages) {
                    str += result.messages[i] + '<br />';
                }

                $.info(str);
                return false;
            }
            
            $form[0].submit();
            
            
            /* 
             * 改为同步提交form
             * 
            // 禁用按钮
            $this.text('提交中...').addClass('disabled');
            
            $.ajax({
                url: '/customer/detail/submit',
                type: 'post',
                data: $form.serialize(),
                dataType: 'json',
                success: function(data){
                    if(data == 0) {
                        //$.info("提交成功");
                        location.href = '/customer-detail'
                    }else {
                        $.info('提交失败，请重试！');
                    }
                    $this.text('提交').removeClass('disabled');
                },
                error: function(){
                    $.info('提交失败，请重试！');
                    $this.text('提交').removeClass('disabled');
                }
            });
            */
           
        });
    
    };
    
});

