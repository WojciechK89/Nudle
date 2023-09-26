const { expect } = require('chai');


const sleep = async function (ms) {
  await new Promise((r) => setTimeout(r, ms))
}

const clickAndType = async function (context, coords, text) {
  await context.page.mouse.click(coords.x, coords.y);
  await typeText(context, text);
}

async function typeText(context, text) {
  const input = await context.page.waitForSelector(">>>input");
  await input.type(text);
  await sleep(500);
}

async function waitFor(condition, maxRetries = 20) {
  let retries = 0;

  return new Promise(async (resolve, reject) => {
    const checkCondition = async () => {
      retries++;
      try {
        await condition()
        resolve();

      } catch (error) {
        if (retries < maxRetries) {
          setTimeout(checkCondition, 0);
        } else {
          reject(error);
        }
      }
    };

    setTimeout(checkCondition, 0);
  });
}


async function clickAtText(context, text, index = 0) {
  await waitForText(context, text);
  const screenshot = await context.page.screenshot({ type: 'jpeg', quality: 100 });
  const result = await context.ocr.recognize(screenshot);
  const coords = result.getElementsByText(text)[index];
  await context.page.mouse.click(coords.x, coords.y);
}

async function waitForText(context, text) {
  //console.trace();
  //console.log(arguments)
  await waitFor(async () => {
    const screenshot = await context.page.screenshot({ type: 'jpeg', quality: 100 });
    const result = await context.ocr.recognize(screenshot);
    const elements = result.getElementsByText(text);
    expect(elements.length).to.be.least(1);
  }, 20);
}

async function clickAndTypeText(context, textToClick, textToInput) {
  await clickAtText(context, textToClick)
  await typeText(context, textToInput)
}


module.exports = {
  sleep,
  clickAndType,
  waitFor,
  typeText,
  clickAtText,
  clickAndTypeText,
  waitForText
}