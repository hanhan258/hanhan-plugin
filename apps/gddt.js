import { segment } from "oicq";
import plugin from '../../../lib/plugins/plugin.js';
import axios from "axios";
import fs from "fs";
import puppeteer from "puppeteer";

const gdkey = Config.gdkey

export class example extends plugin {
    constructor() {
        super({
            name: "高德地图搜索",
            dsc: "使用高德地图API进行地点搜索",
            event: 'message',
            priority: 1,
            rule: [
                {
                    reg: "^搜地点=(.*)$",
                    fnc: 'handleSearchLocation'
                },
                {
                    reg: "^高德搜ip=(.*)$",
                    fnc: 'gdip'
                },
            ]
        });
        this.apiKey = "e5792986a48b14e7e2a0667b5595bfcd"; // 请替换为你的高德地图API密钥
    }


    async handleSearchLocation(e) {
        const match = e.msg.match(/^搜地点=(.*)$/);
        if (!match || !match[1]) {
            await e.reply("请输入有效的搜索地点。");
            return;
        }

        const location = match[1].trim();

        try {
            const searchResult = await this.searchLocation(location);
            const replyMessage = this.buildReplyMessage(searchResult);

            await e.reply(replyMessage);
        } catch (error) {
            console.error("搜索地点出错:", error);
            await e.reply("搜索地点出错，请稍后再试。");
        }
    }

    async searchLocation(location) {
        const url = `https://restapi.amap.com/v3/place/text?key=${this.apiKey}&extensions=all&keywords=${encodeURIComponent(
            location
        )}`;
        const response = await axios.get(url);

        return response.data;
    }

    async buildReplyMessage(searchResult) {
        let filePath = '';
    
        if (searchResult.status === "1" && searchResult.count > 0) {
            const result = searchResult.pois[0];
            const photos = result.photos;
    
            if (photos && photos.length > 0) {
                const photo = photos[0];
                let coverUrl = photo.url;
                filePath = await this.downloadImage(coverUrl);
            }
    
            let msg = [
                segment.image(`file:///${filePath}`),
                `搜索结果：\n名称：${result.name}\n地址：${result.address}\n经纬度：${result.location}\n分类：${result.type}\n邮政编号：${result.postcode}\n所在城市：${result.cityname}\n所在区域：${result.adname}\n特色内容：${result.tag}`
            ];
    
        await this.reply(msg, true, /*{ recallMsg: e.isGroup ? 50 : 0 }*/);
        } else {
            return "未找到匹配的地点。";
        }
    }
    async downloadImage(coverUrl) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(coverUrl, { waitUntil: 'networkidle0' });
        const imageSrc = await page.$eval('img', img => img.src);
        const viewSource = await page.goto(imageSrc);
        const buffer = await viewSource.buffer();
        const folderPath = './plugins/hanhan-plugin/resources/ls/'; // 替换为你想要保存图片的文件夹路径
        const filePath = `${folderPath}/image_gd.png`; // 修改文件路径
        await fs.promises.writeFile(filePath, buffer);
        console.log(`----图片下载完成----`);
        await page.close();
        await browser.close();
        return filePath;
    }
    async gdip(e) {
        console.log("[用户命令]", e.msg);
        let msg = e.msg.replace(/^高德搜ip=/, "").trim();
        msg = msg.split(" ").join("+");
        const url = `https://restapi.amap.com/v3/ip?key=${this.apiKey}&ip=${msg}`;
        const response = await axios.get(url);

        const { province, rectangle, city } = response.data;
        let msg0 = [
            `搜索结果：\n地址：${province}\n经纬度：${rectangle}\n所在城市：${city}`
        ];

        await this.reply(msg0, true, /*{ recallMsg: e.isGroup ? 50 : 0 }*/);
    }
}
