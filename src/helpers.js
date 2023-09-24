const sleep = async function (ms) {
  await new Promise((r) => setTimeout(r, ms))
}

const clickAndType = async function (page, coords, text) {
  await page.mouse.click(coords.x, coords.y);
  const emailInput = await page.waitForSelector(">>>input");
  await emailInput.type(text);
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

module.exports = {
  sleep,
  clickAndType,
  waitFor
}