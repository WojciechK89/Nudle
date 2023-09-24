
const tesseract = require("tesseract.js");
const Jimp = require("jimp");


module.exports = class Ocr {
  #worker;

  async init() {
    this.#worker = await tesseract.createWorker();
    await this.#worker.loadLanguage('eng');
    await this.#worker.initialize('eng', tesseract.OEM.TESSERACT_LSTM_COMBINED);
    await this.#worker.setParameters({
      tessedit_pageseg_mode: tesseract.PSM.SPARSE_TEXT
    })
  }
  async recognize(image) {
    const jimpImage = await Jimp.read(image);
    await jimpImage.writeAsync('lastScreenShot.jpg');

    const processedImage = await jimpImage.normalize().invert().threshold({ max: 106, replace: 0, autoGreyscale: true });

    await processedImage.writeAsync('lastScreenShotProcessed.jpg');
    const buffer = await processedImage.getBufferAsync('image/jpeg');

    const resultsUnprocessed = await this.#worker.recognize(image, {});
    const resultsProcessed = await this.#worker.recognize(buffer, {});

    // console.log(resultsUnprocessed.data.text)
    // console.log(resultsProcessed.data.text)

    return new OcrResult([...resultsUnprocessed.data.lines, ...resultsProcessed.data.lines]);
  }

  async terminate() {
    return this.#worker.terminate();
  }
}


class OcrResult {
  #lines;
  constructor(lines) {

    this.#lines = lines;
  }

  getElementsByText(text) {
    const filteredLines = this.#lines.filter((line) => {
      return line.text.includes(text);
    });

    return filteredLines.map((l) => {
      const x = (l.bbox.x0 + l.bbox.x1) / 2;
      const y = (l.bbox.y0 + l.bbox.y1) / 2;
      return { x, y }
    });
  }
}
