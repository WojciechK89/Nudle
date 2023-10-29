

const puppeteer = require("puppeteer");

const tesseract = require("tesseract.js");
const Ocr = require('./src/ocr');
const Jimp = require("jimp");

const {
    sleep
} = require('./src/helpers');
const parallels = 6;

(async () => {
    const ocr = new Ocr();
    await ocr.init();
    const jimpImage = await Jimp.read('./analyze.jpg');
    for (let max = 0; max <= 255; max++) {
        for (let replace = 0; replace <= 255; replace = replace + parallels) {

            const promises = [];
            for (let i = replace; i < replace + parallels && i < 255; i++) {
                promises.push(test(ocr, jimpImage, {max, replace: i }));
            }
            await Promise.all(promises);
        }
    }


    await ocr.terminate();
})();

async function test(ocr, jimpImage, { max, replace }) {
    console.log('params: max:', max, 'replace: ', replace)
    const result = await ocr.recognizeParams(jimpImage.clone(), { max, replace })
    const found = result.getElementsByText('Invite');

    if (found.length > 0) {
        console.log('found params: max:', max, 'replace: ', replace);
        console.log(found)
        process.exit(1);
    }
}