从 [vultr](https://www.vultr.com/) 买了个 $2.5/月 的虚拟服务器，(还可以用轻松使用[Shadowsocks上网](https://www.diycode.cc/topics/738)

### 简单安装 `node` 环境

使用终端连接 vps

```
ssh root@xxx.xxx.xxx.xxx
```

在命令输入后，你的计算机将进行与远程服务器的连接。如果你是第一次连接你的远程服务器，会出现确认提示，yes 输入密码就好了

然后使用 `wget` 命令下载 `node` 包。

```
wget https://nodejs.org/dist/v8.1.0/node-v8.1.0-linux-x64.tar.xz
```
后面的 `url` 可以到 `node` 官网找到对应版本，右键 复制文件链接 拷贝

解压

```
tar -xvf node-v8.1.0-linux-x64.tar.xz
```

切换并查看当前node所在路径

```
cd node-v8.1.0-linux-x64/bin
pwd
```
复制 node 绝对路径
将node和npm设置为全局

```
sudo ln /root/node-v8.1.0-linux-x64/bin/node /usr/local/bin/node
sudo ln /root/node-v8.1.0-linux-x64/bin/npm /usr/local/bin/npm
```
