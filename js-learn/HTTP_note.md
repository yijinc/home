HTTP遵循经典的client-server 模型，HTTP是无状态协议
在请求与响应之间，还有许多的被称为proxy的实体，他们的作用与表现各不相同，比如网关、代理或caches等

## 目录
- [缓存](HTTP_note.md#缓存)
- [Cookie](HTTP_note.md#Cookie)
- [访问控制（CORS）](HTTP_note.md#CORS)







### 缓存
缓存是一种保存资源副本并在下次请求时直接使用该副本的技术。当 web 缓存发现请求的资源已经被存储，它会拦截请求，返回该资源的拷贝，而不会去源服务器重新下载。这样带来的好处有：缓解服务器端压力，提升性能(获取资源的耗时更短了)。对于网站来说，缓存是达到高性能的重要组成部分。缓存需要合理配置，因为并不是所有资源都是永久不变的：重要的是对一个资源的缓存应截止到其下一次发生改变（即不能缓存过期的资源）。

缓存包含浏览器缓存、代理缓存、网关缓存、CDN、反向代理缓存和负载均衡器等

一般只有GET请求才会被缓存

#### 缓存控制 **Cache-control** 头

请求头和响应头都支持这个属性
- `Cache-Control: max-age=31536000` 过期机制/ 单位：秒
- `Cache-Control: private  / public` 私有缓存和公共缓存
- `Cache-Control: no-cache, no-store` 禁止进行缓存
- `Cache-Control: must-revalidate` 强制确认缓存

#### 缓存处理过程

**Expires** 存储的是一个用来控制缓存失效的日期，*Expires* 头使用的是一个特定的时间，要求客户端和服务器端的时钟严格同步。客户端的时间是可以修改的，如果服务器和客户端的时间不统一，这就导致有可能出现缓存提前失效的情况，存在不稳定性。 面对这种情况，HTTP1.1引入了 **Cache-Control** 头来克服 *Expires* 头的限制。*Cache-Control* 使用max-age制定资源被缓存多久。

当设置了 `Cache-Control: max-age=N` 令缓存寿命为 `N`，客户端发起一个请求时，缓存检索到已有一个对应的缓存副本，当请求时间在寿命`N`内，直接返回缓存副本；当请求时间超过了寿命，缓存会先将此请求附加一个`If-None-Match`头，然后发给目标服务器，以此来检查该资源副本是否依然还是新鲜的（有效的），若服务器返回了 **304** (Not Modified)（该响应不会有带有实体信息），则表示此资源副本是新鲜的，这样节省了带宽。若服务器通过 If-None-Match 或 If-Modified-Since 判断后发现已过期，那么会带有该资源的实体内容返回。

如果 *max-age* 和 *Expires* 同时出现，则 *max-age* 有更高的优先级，浏览器会根据 *max-age* 的时间来确认缓存过期时间。 如果 *max-age* 和 *expires* 属性都没有，找找头里的 *Last-Modified* 信息。如果有，缓存的寿命就等于头里面Date的值减去 **Last-Modified** 的值除以10。

如果缓存的响应头信息里含有 `Cache-control: must-revalidate` 或 用户点击刷新按钮时，会触发缓存校验

作为缓存的一种强校验器，**ETag** 响应头是文件修改时间、文件大小和inode号生成的校验（checksum）值。如果资源请求的响应头里含有 *ETag*, 客户端可以在后续的请求的头中带上 **If-None-Match** 头来验证缓存

作为缓存的一种弱校验器，**Last-Modified** 响应头只能精确到一秒。如果响应头里含有这个信息，客户端可以在后续的请求中带上 **If-Modified-Since** 来验证缓存。

**Vary** 是一个HTTP响应头部信息，决定了对于后续的请求头，如何判断是请求一个新的资源还是使用缓存的文件。当缓存服务器收到一个请求，只有当前的请求和原始（缓存）的请求头跟缓存的响应头里的Vary都匹配，才能使用缓存的响应。
对于服务器提供的某个接口来说，有时候会出现不同客户端应该获取不同资源，比如要区分移动端和桌面端的展示内容（css、图片）、客户端支持的压缩编码方式不同、在IE6浏览器上要输出不一样的内容。所以，服务器提供的同一个接口，客户端进行同样的网络请求，对于不同种类的客户端可能需要的数据不同，服务器端的返回方式返回数据也会不同。对于这个问题的解决，我想很多人是清除的，我们可以在请求信息添加Accept-Encoding、User-Agent等头部，Vary头的内容如果是多条则用 “`,`” 分割。
- **Accept-Encoding** 表示客户端支持的编码格式，常见的编码格式有gzip/compress/deflate/identity，服务器端会根据客户端提供的Accept-Encoding对返回的内容进行编码，并通过添加响应头Content-Encoding表明服务器端使用的编码格式。
- **User-Agent** 表示客户端代理，使得服务器能够识别客户使用的操作系统及版本、CPU 类型、浏览器及版本、浏览器渲染引擎、浏览器语言、浏览器插件等。这样服务器就能区别不同种类的客户端，做出不同的数据返回操作。


#### 加速资源/发布

为了优化缓存，过期时间应设置得尽量长。但对于那些长期不更新的资源，特指网页上引入的一些js/css文件，当它们变动时需要尽快更新线上资源。这时出了一种 **静态资源版本更新与缓存** ，不频繁更新的文件会使用特定的命名方式：在URL后面（通常是文件名后面）会加上版本号（hash或时间戳 变化的字符串）。加上版本号后的资源就被视作一个完全新的独立的资源。

```` html
<link rel="stylesheet" type="text/css" href="a.css?v1"/>
<script type="text/javascript" src="b.js?t=201804231123"></script>
````

但是这么做也存在一个问题，所有引用这个资源的地方都需要更新链接，当低频更新的资源（js/css）变动了，只用在高频变动的资源文件（html）里做入口的改动。

这种方法还有一个好处：同时更新两个缓存资源不会造成部分缓存先更新而引起新旧文件内容不一致。对于网站发布互相有依赖关系的css和js文件，避免这种不一致性是非常重要的。




### Cookie

**Cookie** 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。由于服务器指定Cookie后，浏览器的每次请求都会携带Cookie数据，会带来额外的性能开销（尤其是在移动环境下），新的浏览器有了新的存储API（`sessionStorage`、`localStorage`、 `IndexedDB`），Cookie渐渐被淘汰。

服务器使用 `Set-Cookie` 响应头部向用户代理（浏览器）发送Cookie信息

Cookie 可以指定一个特定的过期时间（Expires）或有效期（Max-Age），当Cookie的过期时间被设定时，设定的日期和时间只与客户端相关，而不是服务端。

> Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;

如果 Cookie 没有指定 Expires 或 Max-Age，浏览器关闭之后它会被自动删除，也就是说它仅在会话期内有效

标记为 `Secure` 的 Cookie 只能通过 HTTPS 请求发送给服务端。  
标记为 `HttpOnly` 的 Cookie 无法通过 JavaScript 的 `Document.cookie` API访问，可在一定程度上避免跨域脚本 (XSS) 攻击

> Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly

**Domain** 和 **Path** 标识定义了Cookie的作用域



### CORS
跨域资源共享CORS（Cross-Origin Resource Sharing）是一种浏览器机制。

**同源策略** ：两个页面/资源的协议，端口（如果有指定）和域名都相同，则为同**源**

前端异步请求数据经常会出现在浏览器控制台里的错误

`
Failed to load https://example.com/: No ‘Access-Control-Allow-Origin’ header is present on the requested resource. Origin ‘https://anfo.pl' is therefore not allowed access. If an opaque response serves your needs, set the request’s mode to ‘no-cors’ to fetch the resource with CORS disabled.
`

出于安全原因，浏览器限制从脚本内（例如 **XMLHttpRequest** 或 **Fetch**）发起的跨**源**HTTP请求，这意味着使用这些API的Web应用程序只能从加载应用程序的同一个域请求HTTP资源，除非响应报文包含了正确CORS响应头。


#### 什么情况下需要 CORS
- 由 XMLHttpRequest 或 Fetch 发起的跨域 HTTP 请求
- Web 字体 (CSS 中通过 @font-face 使用跨域字体资源)
- WebGL 贴图
- 使用 drawImage 将 Images/video 画面绘制到 canvas
- 样式表（使用 CSSOM）


**预检请求（preflight request）** 要求浏览器必须首先使用 OPTIONS 方法发起一个预检请求到服务器，从而获知服务端是否允许该跨域请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 Cookies 和 HTTP 认证相关数据）。

当请求满足下述任一条件时，即应首先发送预检请求
- 使用了下面任一 HTTP 方法（*Access-Control-Request-Method*）：PUT / DELETE / CONNECT / OPTIONS / TRACE / PATCH
- 人为设置了对 [CORS 安全的首部字段集合](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)（*Access-Control-Request-Headers*） 之外的其他首部字段
- *Content-Type* 的值不属于下列之一: `application/x-www-form-urlencoded`、 `multipart/form-data`、 `text/plain`
- 请求中的 *XMLHttpRequestUpload* 对象注册了事件监听器。
- 请求中使用了 *ReadableStream* 对象。

浏览器检测从 JavaScript 中发起的请求需要被预检时，将发送了一个使用 OPTIONS 方法的“预检请求”，该方法不会对服务器资源产生影响。预检请求中携带的 *Access-Control-Request-Method* 或 *Access-Control-Request-Headers* 等信息发送给服务器，服务器决定允许并响应确认这些信息字段。服务器还可能在首部字段加上 *Access-Control-Max-Age*（该响应的有效时间），在有效时间内，浏览器无须为同一请求再次发起预检请求。

#### HTTP 响应首部字段
> Access-Control-Allow-Origin: <origin> | *

**origin** 参数的值指定了允许访问该资源的外域 URI，如果指定了origin，响应首部中的 Vary 字段的值也必须包含 origin 。

**\*** 表示允许来自所有域的请求（**对于不需要携带身份凭证的请求**）。

> Access-Control-Allow-Credentials: true

**Access-Control-Allow-Credentials** 头指定了当浏览器的credentials设置为true时是否允许浏览器读取response的内容。当用在对preflight预检测请求的响应中时，它指定了实际的请求是否可以使用credentials。如果对此类请求的响应中不包含该字段，这个响应将被忽略掉，并且浏览器也不会将相应内容返回给网页。

如果需要发送身份凭证（携带cookie）请求，在js中设置
``` javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.withCredentials = true;  // 向服务器发送 cookie
xhr.onreadystatechange = handler;
xhr.send(); 
```
如果服务器端的响应头部没有 `Access-Control-Allow-Credentials: true`，则响应内容不会返回给请求的发起者。
如果服务器端的响应头设置为 `Access-Control-Allow-Origin: *`，请求将会失败。 而将 *Access-Control-Allow-Origin* 的值设置为发起者的uri，则请求将成功执行。


> Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header

**Access-Control-Expose-Headers** 头让服务器把允许浏览器访问的头放入白名单

这样，在跨域访问时，XMLHttpRequest对象就能够通过getResponseHeader()拿到X-My-Custom-Header和 X-Another-Custom-Header 响应头了。

> Access-Control-Max-Age: <delta-seconds>

**Access-Control-Max-Age** 头指定了preflight请求的结果能够被缓存多久，单位秒

> Access-Control-Allow-Methods: \<method\>[, \<method\>]*

**Access-Control-Allow-Methods** 首部字段用于预检请求的响应。其指明了实际请求所允许使用的 HTTP 方法。

> Access-Control-Allow-Headers: \<field-name\>[, \<field-name\>]*

**Access-Control-Allow-Headers** 首部字段用于预检请求的响应。其指明了实际请求中允许携带的首部字段。