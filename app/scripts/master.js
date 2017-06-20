// 针对ie8 重写getElementsByClassName
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(className, element) {
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}

window.onload = function(){

    var maskLayer = document.getElementById('maskLayer');
    var registerLayer = document.getElementById('registerLayer');


    var closeLayer = document.getElementById('closeLayer').onclick = function(){
        close();
    };

    // 开户
    var accountBtns = document.getElementsByClassName('yan-btn');
    for (var i = 0; i < accountBtns.length; i++) {
        accountBtns[i].onclick = function(){
            open();
        };
    }
    // 关闭层
    function close(){
        removeClass(maskLayer,'layerEffect');
        removeClass(registerLayer,'layerEffect');
        maskLayer.style.visibility     = 'hidden';
        registerLayer.style.visibility = 'hidden';
    }
    // 弹出层
    function open(){
        addClass(maskLayer,'layerEffect');
        addClass(registerLayer,'layerEffect');
        maskLayer.style.visibility     = 'visible';
        registerLayer.style.visibility = 'visible';
    }


    var tempj           = 0;
    var columnarBar     = document.getElementById('columnarBar');
    var columnarBartop  = columnarBar.getBoundingClientRect().top;
    delTextNode(columnarBar);//清除空文本节点

    // columnarBar.childNodes

    var tempi           = 0;
    var serverTypes     = document.getElementById('serverTypes');
    var serverTypesTop  = serverTypes.getBoundingClientRect().top; //元素顶端到可见区域顶端的距离
    var docHeight       = document.documentElement.clientHeight //浏览器可见区域高度。
    delTextNode(serverTypes);

    var brokenLine      = document.getElementById('brokenLine');
    // 如果是ie8以下，直接添加
    if(IEbrowsers() <= 8){
        addClass(brokenLine,'widthEffect');
        for (var i = 0; i < columnarBar.childNodes.length; i++) {
            addClass(columnarBar.childNodes[i],'heightEffect');
        }
    }

    // 监听滚动添加class
    document.onscroll = throttle(scrollEffect,500,500);//至少执行一次

    function scrollEffect(){
        var scorlltop = document.body.scrollTop || document.documentElement.scrollTop;//距离顶部的值
        var scrollThresholdValue = scorlltop + docHeight + 50;//视口阈值
        if(scrollThresholdValue >= serverTypesTop) {
            var s = setInterval(function(){
                if(tempi <= serverTypes.childNodes.length){
                    removeClass(serverTypes.childNodes[tempi],'yan-hide');
                    tempi ++;
                }else{
                    clearInterval(s);
                }
            },200)
        }

        if(scrollThresholdValue >= columnarBartop){
            addClass(brokenLine,'widthEffect');
            var j = setInterval(function(){
                if(tempj <= columnarBar.childNodes.length){
                    addClass(columnarBar.childNodes[tempj],'heightEffect');
                    tempj ++;
                }else{
                    clearInterval(j)
                }
            },100);
        }
    }

    // 差时动画执行
    var tempy = 0;
    var yanlabel = Array.prototype.slice.call(document.getElementsByClassName('yan-label'))
    for (var i = 0; i < yanlabel.length; i++) {
        delTextNode(yanlabel[i]);
    }

    var y = setInterval(function(){
        if(yanlabel[tempy] && tempy <= yanlabel[tempy].childNodes.length){
            for (var j = 0; j < yanlabel[tempy].childNodes.length; j++) {
                addClass(yanlabel[tempy].childNodes[j],'yan-label-effectAnimation'+(j+1));
            }
            tempy ++;
        }else{
            clearInterval(y)
        }
    },500);



    // 鼠标滑动元素缓动
    var centerCircleBox = document.getElementById('centerCircleBox');
    var centerCircle = document.getElementById('centerCircle');
    delTextNode(centerCircle);
    var items = centerCircle.childNodes;
    addEvent(centerCircleBox,'mousemove',function(e){

        var x           = e.clientX;
        var y           = e.clientY;

        var halfWidth    = window.innerWidth;
        var halfHeight   = window.innerHeight;

        var rx          = x - halfWidth;
        var ry          = halfHeight - y;
        var length      = items.length;
        var max         = 30;
        for (var i = 0 ; i < length ; i++) {
            var getCoord = items[i].getBoundingClientRect();
            var dx = (getCoord.width/max)*(rx / -halfWidth);
            var dy = (getCoord.height/max)*(ry / halfHeight);
            if(i == 2){
                items[i].style['transform'] = items[i].style['-webkit-transform'] = 'translate('+(dx*2.5)+'px,'+(dy*2.5)+'px)';
            }else{
                items[i].style['transform'] = items[i].style['-webkit-transform'] = 'translate('+dx+'px,'+dy+'px)';
            }
        }
    })
}
