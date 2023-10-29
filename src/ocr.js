
const tesseract = require("tesseract.js");
const Jimp = require("jimp");


module.exports = class Ocr {
  #workers = [];
  #lastWorker = 0;
  #cores;

  async init(cores = 6) {
    this.#cores = cores;
    for(let i = 0; i < cores; i++){
      const worker = await tesseract.createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng', tesseract.OEM.TESSERACT_LSTM_COMBINED);
      await worker.setParameters({
        tessedit_pageseg_mode: tesseract.PSM.SPARSE_TEXT
      })
      this.#workers.push(worker)
    }

  }
  async recognize(image) {
    const jimpImage = await Jimp.read(image);
    await jimpImage.writeAsync('lastScreenShot.jpg');

    const processedImage = await jimpImage.clone().normalize().invert().threshold({ max: 106, replace: 0, autoGreyscale: true });
    const processedImage2 = await jimpImage.clone().normalize().invert().threshold({ max: 106, replace: 0, autoGreyscale: false });
    const processedImage3 = await jimpImage.clone().normalize().invert().threshold({ max: 17, replace: 9, autoGreyscale: true });
    await processedImage.writeAsync('lastScreenShotProcessed.jpg');
    await processedImage2.writeAsync('lastScreenShotProcessed2.jpg');
    await processedImage3.writeAsync('lastScreenShotProcessed3.jpg');
    const buffer = await processedImage.getBufferAsync('image/jpeg');
    const buffer2 = await processedImage2.getBufferAsync('image/jpeg');
    const buffer3 = await processedImage3.getBufferAsync('image/jpeg');
    const resultsUnprocessed = await this.getWorker().recognize(image, {});
    const resultsProcessed = await this.getWorker().recognize(buffer, {});
    const resultsProcessed2 = await this.getWorker().recognize(buffer2, {});
    const resultsProcessed3 = await this.getWorker().recognize(buffer3, {});

    // console.log('===================resultsUnProcessed===================')
    // console.log(resultsUnprocessed.data.text)
    // console.log('===================resultsProcessed===================')
    // console.log(resultsProcessed.data.text)
    // console.log('===================resultsProcessed2==================')
    // console.log(resultsProcessed2.data.text)
    // console.log('===================resultsProcessed3==================')
    // console.log(resultsProcessed3.data.text)

    return new OcrResult([...resultsUnprocessed.data.lines,
       ...resultsProcessed.data.lines,
        ...resultsProcessed2.data.lines,
         ...resultsProcessed3.data.lines]);
  }


  async recognizeParams(image, params){
    const jimpImage = await Jimp.read(image);
    
    params.autoGreyscale = params.autoGreyscale ?? true;
    
    const processedImage = await jimpImage.clone().normalize().invert().threshold({ max: params.max, replace: params.replace, autoGreyscale: params.autoGreyscale });
    const buffer = await processedImage.getBufferAsync('image/jpeg');
    const resultsProcessed = await this.getWorker().recognize(buffer, {});
    return new OcrResult(resultsProcessed.data.lines);
  }

  getWorker(){
    const worker = this.#workers[this.#lastWorker];
    this.#lastWorker++;
    if(this.#lastWorker >= this.#cores){
      this.#lastWorker = 0;
    }
    return worker;
  }

  async terminate() {
    return this.#workers.map(async (w) => {
      await w.terminate();
    })
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
      console.log({ x, y });
      return { x, y }
    });
  }
}
