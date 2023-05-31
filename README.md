# hanhan-plugin

## 安装

> 下载插件或者复制插件里面的代码，然后放在example文件夹内，然后安装依赖
> 
> 如果条件允许，建议将 `config/pm2/pm2.json` `max_memory_restart` 字段的值改为`1G`，实测自动扫描二维码功能和自动色图评分功能会占用较高内存。
>
> 自动图片审查可以载入本地模型 [模型下载](https://github.com/GantMan/nsfw_model/releases)，经过少量样本对照，nsfw_mobilenet_v2_140_224.zip 135 MB 版本审查的准确率更高。下载完成后把压缩包里面的`web_model_quantized`文件夹丢进云崽根目录即可。

## 安装依赖

因为买家秀用到了`axios`，所以要安装这个依赖，在云崽根目录执行`pnpm install axios -w`，如果你之前装过，可以跳过

自动扫描二维码功能用到了`jimp`和`jsqr`这两个库，请在云崽根目录执行`pnpm i jimp jsqr -w`安装依赖

自动色图评分需要`@tensorflow/tfjs-node`和`nsfwjs`这两个库，请在云崽根目录执行`pnpm i @tensorflow/tfjs-node nsfwjs -w`安装依赖。装不上的话就别折腾了，这个插件对服务器性能要求比较高。

自动图片审查是扫描二维码和涩图评分的合体，需要安装四个依赖`pnpm i jimp jsqr @tensorflow/tfjs-node nsfwjs -w`，占用内存较大，谨慎使用。

安装完依赖之后，重启机器人，就可以食用了

## nav

发送`nav`查看功能

> 憨憨小功能：
>
> (#)mt
>
> (#)mc酱
>
> (#)小c酱
>
> (#)兽猫酱
>
> (#)买家秀
>
> (#)随机ai
>
> (#)兽语帮助
>
> (#)发癫(名字)
>
> (#)今天是几号
>
> (#)url编(解)码
>
> (#)天气+城市名
>
> (#)摩斯加(解)密
>
> (#)历史上的今天
>
> (#)ping (ip/域名)
>
> (#)base64编(解)码
>
> (#)(兽语|猫语|喵语|狗语|动物语)加(解)密

## 功能详情

### 兽语加(解)密

可以发送`兽语帮助`查看相关帮助

### mt

随机返回一张美腿图片

### 发癫

> 指令示例：发癫憨憨或发癫（你要对那个人发癫的名字）
>
> 返回示例：我的裤子老是被我弄破，于是我报了一个补衣服的班。有一天【憨憨】教我们大家缝衣服，她问道：“谁的衣服总是弄坏”，于是我高高举起手向【憨憨】大喊：“我的老破我的老破。”

### 买家秀

随机返回一张淘宝买家秀图片，有的很辣眼睛

### 随机ai

随机返回一张ai图片

### 今天是几号

> 返回示例：
> 公元2023年03月27日
>
> 农历癸卯年闰二月初六
> 兔年
>
> 节气：春分后

### 历史上的今天

返回10条历史上的今天的新闻

### ping ip/域名

点击 https://ipinfo.io 链接进行注册账号，并将token配置到插件的第7行即可

> 返回示例：
>
> 网址：baidu.com
>ip地址：39.156.66.10
> 国家代码：CN
>地区：Beijing
> 城市：Beijing
>经纬度：39.9075,116.3972
> 运营商：AS9808 China Mobile Communications Group Co., Ltd.
>时区：Asia/Shanghai
> 最小延迟：29.549ms
>最大延迟：29.677ms
> 平均延迟：29.599ms
>
> 数据包数：5
>接受数据包：5
> 丢包率：0%
>总耗时：4006ms

### 摩斯加(解)密

> 示例：
> 加密：憨憨	-->	--....--.-.-.../--....--.-.-...
>
> 解密：--....--.-.-.../--....--.-.-...	-->	憨憨

### url编(解)码

> 示例：
> 编码：憨憨	-->	%E6%86%A8%E6%86%A8
>
> 解码：%E6%86%A8%E6%86%A8	-->	憨憨

### base64编(解)码

> 示例：
> 编码：憨憨	-->	5oao5oao
>
> 解码：5oao5oao	-->	憨憨

## 说明

> 调用接口可以实现很简单的的无用小功能，有手就能写，你杠就是你对
>
> 因为是部分功能是调用的接口，接口寄了功能也就寄了，可以给我提issues，我能换接口我就换，找不到我就下架功能。

## 赞助

如果觉得本项目好玩或者对你有帮助，愿意的话可以赞助我一口快乐水：

https://afdian.net/a/hanhanbeea

## 贡献者

<!-- readme: collaborators,contributors -start -->
感谢以下贡献者

<a href="https://github.com/hanhan258/hanhan-plugin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hanhan258/hanhan-plugin" />
</a>

<!-- readme: collaborators,contributors -end -->


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hanhan258/hanhan-plugin&type=Date)](https://star-history.com/#hanhan258/hanhan-plugin&Date)
