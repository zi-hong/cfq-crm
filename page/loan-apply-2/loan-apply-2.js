define( "page/loan-apply-2/loan-apply-2", function(require, exports, module) {

    var $ = require('zepto');
    require('libs/zepto.info');

    require('libs/photoCompress/detect');
    require('libs/photoCompress/jpegEncode2');
    require('libs/photoCompress/jpegmeta');
    require('libs/photoCompress/photocompress');

    module.exports = (function (lib, $, undefined) {


        var $btn_submit = $('#btn-submit'),

            OPTIONS = {

                // 按钮是否禁用
                isDisabled: false,

                MAX_FILESIZE: 5, // 5M

                loadingImg: __uri('/static/img/loading.gif'),

                // 缓存模板
                tmplFun: __inline('/page/loan-apply-2/viewImg.tmpl'),


                /**
                 * [openProgress 开启进度条]
                 * @return {[type]} [description]
                 */
                openProgress: function () {
                    // this=> input[type=file]

                    $('label[for=' + this.id + ']').append('<div class="label-mask"><img src="' + OPTIONS.loadingImg + '" class="loading"></div>');
                },

                /**
                 * [closeProgress 关闭进度条]
                 * @return {[type]} [description]
                 */
                closeProgress: function () {
                    // this=> input[type=file]
                    $('label[for=' + this.id + ']').find('.label-mask').remove();
                },

                /**
                 * [selectFile 选择及压缩文件]
                 * @return {[type]}         [description]
                 */
                selectFile: function () {

                    var _self = this,

                    // 当前files
                    file = _self.files[0],

                    // 最大上传张数
                    maxuploadnum = $(_self).data('maxuploadnum'),

                    PhotoCompress,

                    // 当前已上传图片数量
                    currentNum;

                    OPTIONS.maxuploadnum = maxuploadnum;

                    if (!file) return;

                    // 过滤
                    if (file.size > OPTIONS.MAX_FILESIZE * 1024 * 1024) {
                        $.info('图片大小不超过' + OPTIONS.MAX_FILESIZE + 'M');
                        return;
                    }

                    // 张数限制
                    currentNum = $(_self).closest('dl').find('div.completed').length;

                    OPTIONS.currentNum = currentNum;

                    if (currentNum >= maxuploadnum) {
                        $.info('上传张数已达上限(' + maxuploadnum + '张照)');
                        return;
                    }


                    // 创建进度条
                    OPTIONS.openProgress.call(_self);

                    // 开始压缩
                    PhotoCompress = lib.photocompress;

                    PhotoCompress.compressFile(file, {
                        maxW: 1024,
                        maxH: 10000,
                        quality: 0.5,
                        format: 'image/jpeg'
                    }, function (err, data) {
                        if (err) {
                            if (err.error == PhotoCompress.ERROR.LIMIT_LARGE) {
                            //self.trigger('imgError', '所选图片尺寸过大，请换一张照片试试');
                            } else if (err.error == PhotoCompress.ERROR.LIMIT_SMALL) {
                            //self.trigger('imgError', '所选图片尺寸过小，请换一张照片试试');
                            } else if (err.error == PhotoCompress.ERROR.LOAD_ERROR) {
                            //self.trigger('imgError', '图片加载出错，请换一张图片');

                                OPTIONS.closeProgress.call(_self);

                                $.info('加载出错，请换一张图片!');
                            }
                            return;
                        }

                        // 开始上传
                        OPTIONS.uploadFile.call(_self, data.base64);
                    });

                    // 清空，防止重新选择时查看使用缩略图
                    _self.value = '';
                },

                /**
                 * [uploadFile 上传文件]
                 * @param  {[type]} src    [description]
                 * @return {[type]}        [description]
                 */
                uploadFile: function (src) {
                    var _self = this,

                        currentNum = OPTIONS.currentNum,

                        params = {};

                    params[_self.id] = src;
                    params["userId"] = $(".userId").val();

                    $.ajax({
                        url: '/market/customer/loan/upload',
                        data: params,
                        type: 'post',
                        dataType: 'json'
                    })
                        .done(function (data) {

                            var $dl = $(_self).closest('dl');

                            /*
                             data=> {ret: 0, src: 'xxx.png'}
                             0: 上传成功，非0：上传失败
                             */
                            if (data && data.ret == 0) {

                                // 每行四个m-item模块，超出换行判断
                                if (OPTIONS.maxuploadnum > 3 &&
                                    (currentNum == $dl.find('div.m-item').length ) &&
                                    (currentNum == 3 || currentNum == 7)
                                ) {
                                    $dl.append('<dd><div class="m-item"></div><div class="m-item"></div><div class="m-item"></div><div class="m-item"></div></dd>')
                                }

                                // 插空填充
                                $dl.find('div.m-item').each(function () {
                                    var $this = $(this);

                                    if (!$this.hasClass('completed')) {

                                        $this.addClass('completed')

                                            .removeClass('brd-dotted')

                                            .data('src', data.src)

                                            .css('background-image', 'url(' + src + ')')

                                            .on('click', function (ev) {
                                                OPTIONS['doReview'].call(this, ev, $(this).data('src'));
                                            });
                                        return false;
                                    }
                                });

                                // 设置提交按钮状态
                                OPTIONS['setBtnDidalbed']();

                            } else {
                                $.info('上传失败，请重新上传！');
                            }


                            OPTIONS.closeProgress.call(_self);
                        })
                        .fail(function () {
                            // 关闭进度
                            OPTIONS.closeProgress.call(_self);

                            $.info('请求失败，请重新上传！');
                        });
                },

                /**
                 * [doDelete 删除操作]
                 * @param  {[type]} ev [Event]
                 * @return {[type]}    [description]
                 */
                doDelete: function (ev) {
                    var _self = this,
                        $this = $(this),
                        params = {},
                        name = $this.closest('dl').find('input[type=file]').attr('name'),
                        src = $this.data('src');

                    params[name] = src;
                    params["userId"] = $(".userId").val();

                    $.ajax({
                        url: '/market/customer/loan/upload/delete',
                        data: params,
                        type: 'post',
                        dataType: 'json'
                    })
                        .done(function (data) {

                            if (data && data.ret == 0) {

                                $.info('删除成功！');

                                OPTIONS['removeMaskDialog'].call(_self);

                                $this.addClass('brd-dotted')

                                    .removeClass('completed')

                                    .removeAttr('style')

                                    .removeAttr('data-action')

                                    .off();

                                // 设置提交按钮状态
                                OPTIONS['setBtnDidalbed']();

                            } else {
                                $.info('删除失败，请重新操作！');
                            }
                        })
                        .fail(function () {
                            $.info('请求失败，请重新操作！');
                        });
                },

                /**
                 * [doReview 预览图片]
                 * @param  {[type]} ev     [description]
                 * @param  {[type]} imgsrc [description]
                 * @return {[type]}        [description]
                 */
                doReview: function (ev, imgsrc) {
                    var _self = this,

                        $tmpl = $(OPTIONS.tmplFun({
                            imgsrc: imgsrc || $(this).data('src')
                        })),

                        $mask = $('<div class="ui-mask"></div>'),

                        $btns = $('<div class="ui-dialog-btn-delete">删除</div>');

                    $tmpl.css('min-height', $(window).height());

                    this.$mask = $mask;
                    this.$tmpl = $tmpl;
                    this.$btns = $btns;

                    // 只读
                    if($(".editFlag").val() == 0){
                        return false;
                    }
                    $('body')

                        .append($mask)

                        .append($tmpl)

                        .append($btns)

                        .on('click', '.ui-mask, .ui-dialog', function () {
                            OPTIONS.removeMaskDialog.call(_self);
                        });

                    $btns.on('click', function () {
                        OPTIONS['doDelete'].call(_self, ev);
                    })
                },

                /**
                 * [removeMaskDialog remove mask、dialog and ui-dialog-btn-delete]
                 * @return {[type]} [description]
                 */
                removeMaskDialog: function () {
                    this.$mask.off().remove();
                    this.$tmpl.off().remove();
                    this.$btns.off().remove();
                },

                /**
                 * [doSumbit 提交审核]
                 * @param  {[type]} ev [description]
                 * @return {[type]}    [description]
                 */
                doSumbit: function (ev) {
                    var $this = $(this);

                    // 禁用状态
                    if (OPTIONS.isDisabled) {
                        $.info('尚有必要材料没有上传！');
                        return;
                    }

                    if ($this.hasClass('disabled')) return;

                    // 同步提交
                    //$('form')[0].submit();

                    // 异步提交
                    var $form = $("#form"),
                        userId = $(".userId",$form).val();

                    $.ajax({
                        url: '/market/customer/loan/submit',
                        type: 'post',
                        data: $form.serialize(),
                        dataType: 'json',
                        success: function (data) {
                            if (data.resultCode == 0) {
                                $.info({
                                    message: "提交成功",
                                    onDestroy: function(){
                                        location.href = "/market/customer/detail?userId=" + userId;
                                }});
                            } else {
                                $.info(data.detail);
                            }
                            $this.text('提交').removeClass('disabled');
                        },
                        error: function (data) {
                            $.info(data.detail);
                            $this.text('提交').removeClass('disabled');
                        }
                    });
                },

                /**
                 * [setBtnDidalbed 设置审核按钮禁用状态]
                 */
                setBtnDidalbed: function () {

                    OPTIONS.isDisabled = false;

                    // 必填资料判断
                    $('[data-require]').each(function () {
                        var $this = $(this);

                        if ($this.data('require') &&
                            $this.find('div.completed').length == 0) {

                            OPTIONS.isDisabled = true;

                            $btn_submit.addClass('disabled');

                            return false;
                        }

                        $btn_submit.removeClass('disabled');
                    });
                }
            };


        OPTIONS.setBtnDidalbed();


        $('body')

            // input file trigger
            .on('change', 'input[type="file"]', function () {
                OPTIONS.selectFile.call(this);
            })

            // form submit
            .on('click', '[data-action]', function (ev) {
                ev.preventDefault();

                var actionName = $(this).data('action') || '';

                if (!actionName) {
                    console.warn('[Action] is Empty, do nothing!');
                    return;
                }

                OPTIONS[actionName].call(this, ev);
            });

            return {'a':1}
        })(window.lib, $);

});