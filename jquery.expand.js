(function($){
    var fnull = function(){};

    var utils = {
        getHiddenAttribute:function(elem,attrName){
            if(! elem instanceof jQuery){
                elem = jQuery(elem);
            }

            var
                props = { position: 'absolute', visibility: 'hidden', display: 'block'},
                old = {},
                result
            ;
            props[attrName] = 'auto';

            for (var name in props){
                old[name] = elem.css(name);
                elem.css(name,props[name]);
            }

            result = elem[attrName]();
            for (var name in props){
                elem.css(name,old[name]);
            }

            return result;
        }
    };


    var expander = function(config){
        this.init(config)
    };


    var defaults = {
        min:'25%',
        max:'auto'
    };

    var engine = {
        expand:function(object,height){
            object.animate({height:height});
        },
        collapse:function(object,height){
            object.animate({height:height});
        }
    };

    var proto = {
        init:function(config){
            config = config||{};
            this.config = $.extend(defaults,config);
            console.log(this.config);
            this.element = config.element;
            this.isExpanded = false;
            this.triggerElement = config.getTrigger(config.element);
            this.triggerElement.on('click', $.proxy(this.onClick,this));
            this.engine = engine;
            this.element.height(this.getHeight('min'));
        },
        onClick:function(e){
            e.preventDefault();
            if(this.isExpanded){
                this.collapce();
                this.isExpanded = false;

            }else{
                this.expand();
                this.isExpanded = true;

            }
        },
        getHeight:function(name){
            var
                result,
                param = this.config[name]
                ;
            if(param=='auto') {

                result = utils.getHiddenAttribute(this.element, 'height');
            }else if(typeof param =='string' && param.search('%')!=-1){
                result = parseFloat(param.substring(0,param.length-1))/100 * utils.getHiddenAttribute(this.element,'height');
            }else{
                result = param;
            }
            return result;
        },
        expand:function(){
            var height = this.getHeight('max');
            this.engine.expand(this.element,height);
            this.element.trigger('afterExpand');
        },
        collapce:function(){
            var height = this.getHeight('min');
            this.engine.collapse(this.element,height);
            this.element.trigger('afterCollapce');
        }
    };

    expander.prototype = proto;

$.fn.expand = function(config){
    this.each(function(){
        config['element'] = $(this);
        new expander(config)
    });
    return this;
}
    $.fn.expand.defaults = defaults;

})(jQuery)
