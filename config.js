const process = require("process");
const minimist = require("minimist");
let argv = minimist(process.argv.slice(2));

module.exports = {
  server: argv.server || "http://localhost:4444/wd/hub",
  env_url: argv.url || "https://creditcards.com/#",
  timeout: argv.timeout || 10000,
  sleep: argv.sleep || 1000,
  capabilities: {
    "browserName": argv.browser || "chrome",
    "version": argv.version,
    "takesScreenshot": true,
    "browserstack": {
      "user": argv.user,
      "key": argv.key
    }
  },
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'UTF-8',
    'Content-Type': 'application/json',
  }
};
