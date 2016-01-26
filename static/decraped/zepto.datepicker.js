/**
 * @zepto插件
 * @author jiajianrong
 * 使用
 * 
 * 
 * <div class="item-con item-text">
 *     <div class="select placeholder" id="domId" data-title="请输入年份">请输入年份</div>
 *     <input type="hidden" name="chushengnian" value="" maxlength="4" placeholder="请输入年份" />
 * </div>
 * $('#domId').datepicker('year',{title:'请选择年份'});
 */
define( 'libs/zepto.datepicker', function(require, exports, module) {
    'use strict';
    
    var //etpl = require('etpl'),
        $ = require('zepto'),
        $body = $('body'),
        $mainDoms = $body.children(':not(style)').filter(':not(script)'),
        origScrollTop,
        tpl = __inline('zepto.datepicker.tpl'),
        
        _create = function(){
            $body.append($(tpl({
                title: this._options.title || '',
                _maxHeight: $(window).height()*0.8
            })));
            
            origScrollTop = $body.scrollTop();
            $mainDoms.addClass('date-picker-force-invisible');
        },
        
        _destroy = function(){
            $body.find('.modal').off().remove();
            $body.find('.modal-mask').remove();
            
            $mainDoms.removeClass('date-picker-force-invisible');
            $body.scrollTop(origScrollTop);
            
            return false;
        },
        
        _moveNext = function(){
            var curr = $body.find('.modal-body .year-items.year-items-shown'),
                next = curr.next('.year-items');
            
            next.addClass('year-items-shown');
            next.size() && curr.removeClass('year-items-shown');
            
            return false;
        },
        
        _movePrev = function(){
            var curr = $body.find('.modal-body .year-items.year-items-shown'),
                prev = curr.prev('.year-items');
            
            prev.addClass('year-items-shown');
            prev.size() && curr.removeClass('year-items-shown');
            
            return false;
        },
        
        _locateYear = function(y){
            $body.find('.modal .year-items a').each( function(idx,item){
                if ( y == $(item).text() ) {
                    var parent = $(item).parents('.year-items').addClass('year-items-shown');
                    parent.siblings().removeClass('year-items-shown');
                    return false;
                }
            } );
        },
        
        _selectYear = function(e){
            var year = $(e.target).text();
            this._options.onSelected && this._options.onSelected(year);
            _destroy();
            
            return false;
        };
    
    
    
    $.fn.datepicker = function(type,opts){
        
        opts = opts || {};
        
        // 假设我们以后还会扩展出monthpicker, daypicker
        if ( type=='year' ) {
            
            this.on('click', function(e){
                
                var self = $(this),
                    //y1 = self.val(),
                    y1 = self.text(),
                    yPicker = new YearPicker( $.extend(opts, {
                        // 单击年份输入框时的默认值，用以在控件中定位已选中年份页
                        currentVal: y1,
                        // 回调，在控件中选取某年份后，将值写回年份输入框
                        onSelected: function(y2){
                            // self.val(y2)
                            self.text(y2);
                            self.siblings('input').val(y2);
                        }
                    }) );
                
                yPicker.run();
                return false;
            });
            
        }
    };
    
    
    
    function YearPicker(opts) {
        this._options = opts;
    }
    
    
    YearPicker.prototype.run = function() {
        
        // 添加dom到body
        _create.apply(this);
        
        // 定位已选中年份页
        _locateYear(this._options.currentVal);
        
        // 注册各种事件，将在destroy里统一销毁
        var $modal = $body.find('.modal');
            
        $modal.on('click.datepicker.close', '.icon-close',  _destroy);
        $modal.on("click.datepicker.prev",  '.prev',        _movePrev);
        $modal.on("click.datepicker.next",  '.next',        _moveNext);
        $modal.on("click.datepicker.pick", ".year-items a", $.proxy(_selectYear,this));
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});