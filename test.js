const Ocr = require('./src/ocr');


(async () => {
  const ocr = new Ocr();
  await ocr.init();

  const result = await ocr.recognize('./test.jpg');



  await ocr.terminate();
})();
