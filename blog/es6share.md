##ES6

ES6标准是在 2015 年 6 月正式发布的，至今已有有 2 年多了。
ES6 拥有一系列 JavaScript 新特性的标准，能让开发变得更简单。可以使用[ Babel ](https://babeljs.cn/) 将你写的es6转化成es5，不用担心现有环境是否支持

现在大多前端都采用es6去编写代码，或部分使用了es6的新特性，很多框架也是采用并全力推荐使用es6，如 react

###教程推荐
- [阮一峰 - ECMAScript 6 入门教程](http://es6.ruanyifeng.com/)
- [MDN JavaScript 标准库](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)

###举例
1 . **解构赋值**：经常可以碰到去请求后端数据多（分类）的时候，提取json，需要依次给变量赋值时
``` javascript
const response = {
	homeData: { distance: 100, score: 1 },
	guestData: { distance: 200, score: 2 }
}
const { homeData, guestData } = response;
// homeData = { distance: 100, score: 1 }
// guestData = { distance: 200, score: 2 }
```

模块系统也用到解构赋值
``` javascript
import React, { Component } from 'react'
// Component === React.Component
```

-----

2 . **Object.assign( )**：我们需要编辑一个球员player，要求在编辑过程中可以随时取消，所以需要**深拷贝**这个对象，以便修改这个新对象后，且可以退回到原来的对象

``` javascript
const player = {
	id: 1,
	name: '张三',
	phone: '13800000000'
	};

//拷贝player至editPlayer并增加了isEdit标志
const editPlayer = Object.assign({}, player, { isEdit: true });
```
还有很多实用的操作对象或数组的方法，比如Array.fill()、

---
3 . **class** ：类
```  javascript

const btn = document.getElementById('btn');

class Component {
    constructor() {
        this.name = "component";
    }
}

class MyComponent extends Component {
    constructor() {
        super();
        //如果我们需要单独调用 printName 方法，必须绑定this指向
        this.printName = this.printName.bind(this);
    }

    //在类中定义方法 前面不需要加上 function 关键字
	printName() {
	    console.log(`Hello ${this.name}`);
	}
	apply() {

        //事件绑定  this指向为该对象（btn）
        btn.onclick = this.printName


	 // 2 直接调用类中的方法或者将它绑定给其他事件, 使用箭头函数并将方法 触发写在函数内
//	    btn.onclick = (e)=> { this.printName() }
        }
}
```
类的所有方法都定义在类的 `prototype` 属性上面，new MyComponent( ) 出来的的实例对象可直接调用 printName 方法，因为 `this` 指向实例对象；
而直接调用类中的方法或者将它绑定给其他事件，都会报 `this` 指向错误，所以需要绑定 this  。[例子](https://yijinc.github.io/learn/js01/es6Class.html)