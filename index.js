const puppeteer = require("puppeteer");
const { Webhook } = require('discord-webhook-node');
const config = require("./config")
const hook = new Webhook(config.webhook);

(async () => {
    console.log(">> 브라우저 실행 중")
    const code = `selfcheck_${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getHours()}_${new Date().getMinutes()}`
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({
        width: 540,
        height: 1110
    })
    console.log(">> 사이트에 접속 중")

    await page.goto(config.checklink);
    await page.waitForSelector("#btnConfirm");
    console.log(">> 설문 응답 중")
    await page.evaluate(() => {
        document.querySelector("#rspns011").click()
        document.querySelector("#rspns02").click()
        document.querySelector("#rspns070").click()
        document.querySelector("#rspns080").click()
        document.querySelector("#rspns090").click()
        setTimeout(()=>{
            document.querySelector("#btnConfirm").click()
        },1000)

    });
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({
        fullpage: true,
        path: `./screenshots/${code}.jpg`
    })
    hook.send(`자가진단 완료 : ${code}`)
    hook.sendFile(`./screenshots/${code}.jpg`);
    await page.close();
    await browser.close();
    await new Promise(r => setTimeout(r, 2000));
    process.exit(0)
})();