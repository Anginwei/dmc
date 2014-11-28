#简介#
dmc是一个微型的JavaScipt库，名字取自DevilMayCry  
dmc的大多数API都仿照JQuery， 使用方法跟JQuery基本一致，虽然一些API的名字跟JQuery一样，但是参数跟返回不同，务必注意。  
JQuery具有的特性，dmc也具有，比如链式调用，不一一列出。dmc的选择器引擎是一个叫`mini`的引擎，支持大多数CSS2选择器，不支持`+`选择器。
#开始#
dmc使用$作为替代符号，如果页面中有其他JS库使用了$，则dmc不会覆盖$。  
通过选择器字符串获取dom元素集合后，就可以像JQuery一样调用实例方法了。

    $("#test").addClass("nav");
dmc初始化方法有两个参数`dmc(selector, context)`。  
`selector`类型可以为选择器字符串、dom元素、dom元素数组、dmc对象。
`context`作为选择器的上下文对象，不指定的话为`document`。因此，可以像下面一样指定选择范围

    var main = document.getElementByName("main");
    $(".nav", main);
#许可#
许可？这是什么东西？What the fuck is this?
