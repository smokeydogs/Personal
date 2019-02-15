let WebDriver = require('selenium-webdriver');
let config = require("../config.js");
let Promise = require("bluebird");
let fs = require('fs');
require("chromedriver");


function RestSuite(name, tests) {
  describe(name, function() {

      tests();
  });
}

function UISuite(name, tests) {
  describe(name, function() {
    it("Start browser", Promise.coroutine(function* () {
      this.driver = new WebDriver.Builder()
        .withCapabilities(config.capabilities)
        .build();

      yield this.driver.get(config.env_url);
    }));

    tests();

    it("Close Browser", Promise.coroutine(function* () {
      yield this.driver.quit();
    }));

    // Save a screenshot after each test failure
    afterEach(Promise.coroutine(function*() {
      let test = this.currentTest;
      if (this.driver && test.state === "failed") {
          let image = yield this.driver.takeScreenshot();
          let title = Date.now() + ":" + test.fullTitle().replace(/\s/g, "-").toLowerCase();
          let path = "screenshots/" + title + ".png";
          return fs.writeFileSync(path, image, "base64");
      }
    }));
  });
}



module.exports = {
    Rest: RestSuite,
    UI: UISuite
};
