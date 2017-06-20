/**
*判断是元素否有class
*@param:elements(elementsObj) 元素对象
*@param:cName(className) class名称
*/
function hasClass(elements, cName) {
    if(!elements){return;}
    // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
};

/**
*给目标元素添加class
*@param:elements(elementsObj) 元素对象
*@param:cName(className) class名称
*/
function addClass(elements, cName) {
    if(!elements){return;}
    if (!hasClass(elements, cName)) {
        elements.className += " " + cName;
    };
};

/**
*移除目标元素class
*@param:elements(elementsObj) 元素对象
*@param:cName(className) class名称
*/
function removeClass(elements, cName) {
    if (hasClass(elements, cName)) {
        // replace方法是替换
        elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
    };
};

/**
*删除空文本节点
*@param:elements(elementsObj) 元素对象
*/
function delTextNode(elem) {
    var elem_child = elem.childNodes;
    for (var i = 0; i < elem_child.length; i++) {
        if (elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)) {
            elem.removeChild(elem_child[i])
        }
    }
}

/**
* 添加事件处理程序
* @param object object 要添加事件处理程序的元素
* @param string type 事件名称，如click
* @param function handler 事件处理程序，可以直接以匿名函数的形式给定，或者给一个已经定义的函数名。匿名函数方式给定的事件处理程序在IE6 IE7 IE8中可以移除，在标准浏览器中无法移除。
* @param boolean remove 是否是移除的事件，本参数是为简化下面的removeEvent函数而写的，对添加事件处理程序不起任何作用
*/
function addEvent(object, type, handler, remove) {
    if (typeof object != 'object' || typeof handler != 'function')
        return;
    try {
        object[remove ? 'removeEventListener' : 'addEventListener'](type, handler, false);
    } catch (e) {
        var xc = '_' + type;
        object[xc] = object[xc] || [];
        if (remove) {
            var l = object[xc].length;
            for (var i = 0; i < l; i++) {
                if (object[xc][i].toString() === handler.toString())
                    object[xc].splice(i, 1);
                }
            } else {
            var l = object[xc].length;
            var exists = false;
            for (var i = 0; i < l; i++) {
                if (object[xc][i].toString() === handler.toString())
                    exists = true;
                }
            if (!exists)
                object[xc].push(handler);
            }
        object['on' + type] = function() {
            var l = object[xc].length;
            for (var i = 0; i < l; i++) {
                object[xc][i].apply(object, arguments);
            }
        }
    }
}
/*
 * 移除事件处理程序
*/
function removeEvent(object, type, handler) {
    addEvent(object, type, handler, true);
}

/**
*判断ie浏览器
*@param
*/
function IEbrowsers(){
    var userAgent   = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE        = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE浏览器
    if (isIE) {
        var IE5 = IE55 = IE6 = IE7 = IE8 = false;
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        return fIEVersion;
    } //isIE end
}

/**
*函数节流
*@param:method(function) 执行函数
*@param:delay(Number) 节流时间
*@param:duration(Number) 固定间隔必须执行
*/
function throttle(method, delay, duration) {
    var timer = null,
        begin = new Date();
    return function() {
        var context = this,
            args = arguments,
            current = new Date();;
        clearTimeout(timer);
        if (current - begin >= duration) {
            method.apply(context, args);
            begin = current;
        } else {
            timer = setTimeout(function() {
                method.apply(context, args);
            }, delay);
        }
    }
}
