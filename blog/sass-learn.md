# sass

## 安装Sass和Compass
`sass` 基于Ruby语言开发而成，因此安装 `sass` 前需要安装 `Ruby`。（注:mac下自带Ruby无需在安装Ruby!）
然后用 `Ruby`自带的`RubyGems`的系统安装 `Sass`和`Compass`
``` ruby
//安装如下(如mac安装遇到权限问题需加 sudo gem install sass)
gem install sass
gem install compass
```
## 编译sass
`sass`编译有很多种方式，如命令行编译模式、sublime插件`SASS-Build`、编译软件`koala`、前端自动化软件`codekit`、Grunt工作流`grunt-sass`、Gulp工作流`gulp-ruby-sass`、webpack工作流`sass-loader`等。

## 使用

- 使用`$`符号来标识变量(老版本使用`!`来标识变量)。 (`less` 使用 `@`)
``` 
$my-font: "Myriad Pro"、Myriad、"Helvetica Neue"; // 声明变量
a {
    $myColor: #f60; //声明内部变量
    color: $myColor; //使用变量 内部
    font-family: $my-font; //使用变量 外部 
}
```
- 默认变量值 `!default`。(`less` 无该语法)
```
$fancybox-width: 400px !default; //如果下列在此行之前声明，此行将失效
$fancybox-width: 200px; 
.fancybox {
	width: $fancybox-width; //400px;
}
```

- 使用`&`标识符连接父选择器
``` 
.item a {
    color: blue;
    &:hover {
	    color: red
    }
    ul.list & {
	    color: green
    }
}

//编译后 css
.item a { color: blue }
.item a:hover { color: red }
ul.list .item a { color: green } /*编译时碰到 & 会将父选择器替换到这 */
```

- 子组合选择器和同层组合选择器：`>`、`+`和`~`
```
article {
  ~ article { border-top: 1px dashed #ccc }
  > section { background: #eee }
  dl > {
    dt { color: #333 }
    dd { color: #555 }
  }
  + p { margin-top: 0 }
}

//编译后
article ~ article { border-top: 1px dashed #ccc }
article > section { background: #eee }
article dl > dt { color: #333 }
article dl > dd { color: #555 }
article + p { margin-top: 0 }
```
- 嵌套属性。 (`less`无该语法)
```
nav {
  border: {
	  style: solid;
	  width: 1px;
	  color: #ccc;
  }
}
```
- 样式导入
```
@import "common" // 导入common.sass or common.scss 文件，扩展名可省略
@import "themes/night-sky" // 导入themes/_night-sky.scss文件 _night-sky.scss作局部文件，可省略 下划线 _ 
.blue-theme {@import "blue-theme"} //嵌套导入
CSS@import "style.css" //导入原生css
```

- 混合器，使用`@mixin`标识符定义，通过`@include`来使用。（`less`中直接应用 `selector() `）

```
@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners; //使用
}
```
```
@mixin link-colors(
    $normal,
    $hover: $normal,
    $visited: $normal
  )
{
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
```
上面是`@mixin`传参 ，其中 `$hover` 和 `$visited` 有默认参数
- 使用 `@extend `继承选择器
```
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```
- SassScript 支持数字的加减乘除、取整等运算 (`+, -, *, /, %`)，如果必要会在不同单位间转换值 , 还有控制指令`@if` `@for` `@each` 等支持自定义函数

## sass vs less
- `sass`有变量和作用域，有函数的概念，语法丰富
- `less`编译简单方便更适合node，无需安装Ruby
