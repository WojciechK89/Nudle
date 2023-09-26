# Description:
First if you don't have already insstall node.js

## Install:
npm ci

### Create file "config.js" in the main folder and add there this script:
```
const URL = "https://lerex-prepoduction.d3pj531ws5mydw.amplifyapp.com/#/login";
const EMAIL = 'your@emial.com;
const PASSWORD = 'yourpassword';
const defaultViewport = {width: 600, height: 1500}

module.exports = {
    URL,
    EMAIL,
    PASSWORD,
    defaultViewport
}

```

### Run
npm test
