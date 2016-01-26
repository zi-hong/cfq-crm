define("page/signature/signature", function(require, exports, module) {

    var $ = require('zepto');


    require('libs/zepto.info');

    require('page/signature/signaturePad');

    module.exports = (function(window, $, undefined) {

        var $signature = $('section.signature'),

            $row_canvas = $('.row-canvas', $signature),

            $canvas = $('#canvas'),

            // 计算视口宽高
            $win = $(window),

            // safari 默认宽度是 980, 取 window, body宽度最小值
            winW = Math.min($win.width(),$("body").width()),

            winH = $win.height(),

            signatureObj, canvasH, canvasW,

            // 初始签名示例
            initSignatureExample = (function() {
                //var _tmpl = baidu.template('signature-example-tpl', {});
                var _tmpl = __inline('/page/signature/signature.tmpl');

                return {
                    tmpl: $(_tmpl({
                        src: __inline("/static/img/page/name_h.png")
                    })),
                    create: function() {
                        var me = this,
                            _tmpl = me.tmpl;

                        $('body').append(_tmpl);

                        _tmpl.css({
                                height: winH
                            })
                            .on('click', function(e) {
                                _tmpl.animate({
                                    translate3d: winW + 'px,0,0'
                                }, 800, 'ease-out', function() {
                                    me.destroy();
                                });
                            });
                    },
                    destroy: function() {
                        var me = this;

                        me.tmpl.off().remove();
                    }
                }
            })();


        // 初始化签名弹窗
        $('body')

        .css('overflow', 'hidden')

        .on('touchmove', function(e) {
            e.preventDefault();
        })

        .on('click', '.btn-clear', function() {
            signatureObj.clear();
        })

        // 提交
        .on('click', '.btn-save', function() {
            var $this = $(this),
                _text = $this.text(),

                // 用户ID
                _userId = $('#userId').val();

            // 空值
            if (signatureObj.isEmpty()) {
                $.info("请在签字板上签名");
                return;
            }



            // 禁用
            if ($this.hasClass('disabled')) return;

            if (!confirm("确定提交吗？")) {
                return;
            }


            $this.addClass('disabled').text('请求处理中...');

            // POST 请求
            $.post('/market/customer/carDealerSign/submit', {
                "carDealerImgsrc": signatureObj.toDataURL('image/jpeg'),
                "userId": _userId
            }).done(function(data) {

                if (data == 1) {
                    
                    // 签署合同，成功时给出提示
                    $.info({
                        message: "签署成功!",
                        onDestroy: function() {
                            location.href = '/market/customer/detail?userId=' + _userId
                        }
                    });

                } else {
                    $.info('提交失败，请重试！');

                    $this.removeClass('disabled').text(_text);
                }
            }).fail(function() {
                $.info('请求失败，请重试！');

                $this.removeClass('disabled').text(_text);
            });
        });

        canvasW = winW - 12; // 处理画笔偏移问题
        canvasH = winH - $('.container').find('.navbar').height() - $signature.find('.row-buttons').height() - 28;

        $canvas.width(canvasW);
        $canvas.height(canvasH);

        $canvas[0].width = canvasW;
        $canvas[0].height = canvasH;

        signatureObj = new SignaturePad($canvas[0], {
            backgroundColor: '#fff'
        });

        // 初始化示例
        initSignatureExample.create();

    })(window, $);

});