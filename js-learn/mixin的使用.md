Mixin 的特性一直广泛存在于各种面向对象语言，它的实质上是利用语言特性（比如 Ruby 的 include 语法、Python 的多重继承、ES6 的 Decorator）来更简洁地实现[组合模式](https://en.wikipedia.org/wiki/Composite_pattern)。



### 封装一个 Mixin 方法

``` javascript

// 用赋值的方式将 mixins 对象里的方法都挂载到原对象上，就实现了对对象的混入。

const mixin = function(obj, mixins) {
  const newObj = obj;
  newObj.prototype = Object.create(obj.prototype);

  for (let prop in mixins) {
    if (mixins.hasOwnProperty(prop)) {
      newObj.prototype[prop] = mixins[prop];
    }
  }

  return newObj;
}


const BigMixin = {
  fly: () => {
    console.log('I can fly');
  }
};

const Big = function() {
  console.log('new big');
};

const FlyBig = mixin(Big, BigMixin);

const flyBig = new FlyBig(); // 'new big'
flyBig.fly(); // 'I can fly'

```

underscore 中的 extend 或 lodash 中的 assign 方法，或者说在 ES6 中一个方法 Object.assign() 可以简单实现mixin


### React Mixins 混入使用

```javascript

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return <div>foo</div>;
  }
});

```

以官方封装的 [PureRenderMixin](https://reactjs.org/docs/pure-render-mixin.html) 来举例，在 createClass 对象参数中传入一个 mixins 的数组，里面封装了我们所需要的模块。mixins 也可以增加多个重用模块，使用多个模块，方法之间的有重合会对普通方法和生命周期方法有所区分。

### Vue.js Mixins 混入使用

```javascript

// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"

```

更多见 [vue.js - 混入](https://cn.vuejs.org/v2/guide/mixins.html) 


### 在 ECMAScript6 class 语法上 修饰器（Decorator）实现混入

将mixin写成一个修饰器，放在通用脚本 `mixins.js`
``` javascript
export function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list);
  };
}
```

然后，就可以使用上面这个修饰器，为类“混入”各种方法。

``` javascript
import { mixins } from './mixins';

const Foo = {
  foo() { console.log('foo') }
};

@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo() // "foo"

```


### es6的修饰器（Decorator）语法

修饰器（Decorator）是一个函数（上面为mixins函数），用来修改类的行为。修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。基本上，修饰器的行为就是下面这样。
``` java
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```
修饰器函数的第一个参数，就是所要修饰的目标类。
``` javascript
function testable(target) {
  // ...
}
```
如果觉得一个参数不够用，可以在修饰器外面再封装一层函数。
``` javascript
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```
上面的例子是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的 `prototype` 对象操作。

修饰器不仅可以修饰类，还可以修饰类的属性。
``` javascript 
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```
上面代码中，修饰器readonly用来修饰“类”的name方法。

此时，修饰器函数一共可以接受三个参数，第一个参数是所要修饰的目标对象，第二个参数是所要修饰的属性名，第三个参数是该属性的描述对象。
``` javascript
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);
```

参考：[阮一峰 es6入门 - 修饰器 ](http://es6.ruanyifeng.com/#docs/decorator)