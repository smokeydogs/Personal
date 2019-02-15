var Promise = require('bluebird');
var config = require('../config.js');

Promise.longStackTraces();

module.exports = function (driver) {
  return {

    mouse: Promise.coroutine(function * (textValue) {
      try {
      const actions = driver.actions({bridge: true});
      const elem = yield driver.findElement({
        partialLinkText: textValue
      });
      yield actions.move({duration:5000,origin:elem,x:200,y:0}).perform();
    } catch(err) {
      console.log("E ", err)
    }
    }),

    getArray: Promise.coroutine(function * (selector) {
      let locator = this._locator(selector);
      yield this._exists(true, locator);
      let elements = yield driver.findElements(locator);
      let element_array = [];

      for (let i = 0; i < elements.length; i++) {
        element_array.push(yield elements[i]);
      }
      return element_array;
    }),

    goTo: Promise.coroutine(function * (url) {
      yield driver.get(url);
    }),

    getUrl: Promise.coroutine(function * () {
      var currentUrl = yield driver.getCurrentUrl();
      return currentUrl;
    }),

    // This must be used over the close for the 3rd party distributed services
    close: Promise.coroutine(function * () {
      yield driver.quit();
    }),

    quit: Promise.coroutine(function * () {
      yield driver.quit();
    }),

    refresh: Promise.coroutine(function * () {
      yield driver.navigate().refresh();
    }),

    sleep: Promise.coroutine(function * (timeout) {
      yield Promise.delay(timeout * 1000 || config.sleep);
    }),

    click: Promise.coroutine(function * (selector) {
      var locator = this._locator(selector);
      try {
        yield this._click(locator);
      } catch (err) {
        yield this._click(locator);
      }
    }),

    clickLink: Promise.coroutine(function * (textValue) {
      try {
        yield this._click({
          partialLinkText: textValue
        });
      } catch (err) {
        yield this._click({
          partialLinkText: textValue
        });
      }
    }),

    linkExists: Promise.coroutine(function * (textValue, timeout) {
      yield this._exists(true, {
        partialLinkText: textValue
      }, timeout);
    }),

    linkDoesNotExist: Promise.coroutine(function * (textValue, timeout) {
      yield this._exists(false, {
        partialLinkText: textValue
      }, timeout);
    }),

    exists: Promise.coroutine(function * (selector, timeout) {
      var locator = this._locator(selector);
      yield this._exists(true, locator, timeout);
      return true;
    }),

    doesNotExist: Promise.coroutine(function * (selector, timeout) {
      var locator = this._locator(selector);
      yield this._exists(false, locator, timeout);
    }),

    isEnabled: Promise.coroutine(function * (selector, timeout) {
      var locator = this._locator(selector);
      yield this._exists(false, locator, timeout);

      yield locator.isEnabled();
    }),

    sendKeys: Promise.coroutine(function * (selector, text) {
      var locator = this._locator(selector);
      var elem = yield driver.findElement(locator);

      yield elem.sendKeys(text);
    }),

    executeScript: Promise.coroutine(function * (script) {
      yield driver.executeScript(script);
    }),

    input: Promise.coroutine(function * (selector, text, clear) {
      var locator = this._locator(selector);
      yield this._exists(true, locator);
      var elem = yield driver.findElement(locator);
      var tagName = yield elem.getTagName();

      yield elem.click();
      if (clear) {
        yield elem.clear();
      };
      yield elem.sendKeys(text);
    }),

    getText: Promise.coroutine(function * (selector) {
      var locator = this._locator(selector);
      yield this._exists(true, locator);
      var elem = yield driver.findElement(locator);
      return yield elem.getText();
    }),

    hasText: Promise.coroutine(function * (selector, timeout) {
      var locator = this._locator(selector);
      yield this._exists(true, locator);

      var tick = Promise.coroutine(function * () {
        var element = yield driver.findElement(locator);
        var text = yield element.getText();
        return (text == /\S+/);
      });

      function textPresent () {
        return tick().catch(function (e) {
          switch (e.name) {
            case 'StaleElementReferenceError':
              return false;
            default:
              throw e;
          }
        });
      }

      yield driver.wait(textPresent, (timeout || properties.timeout), `Text for ${selector} was incorrect.  Expected Some Text.`);
    }),

    getAttribute: Promise.coroutine(function * (selector, attributeName) {
      var locator = this._locator(selector);
      yield this._exists(true, locator);
      var elem = yield driver.findElement(locator);
      return yield elem.getAttribute(attributeName);
    }),

    changeWindow: Promise.coroutine(function * (window) {
      var poll_ = Promise.coroutine(function * poll_ () {
        var handles;
        do {
          yield Promise.delay(100);
          handles = yield driver.getAllWindowHandles();
        } while (handles.length < 2);
        return handles;
      });

      var handles = yield poll_().timeout(config.timeout, 'Polling for new window timed out.');
      yield driver.switchTo().window(handles[window]);
    }),

    waitForUrl: Promise.coroutine(function * (waitUrl, timeout) {
      for (var i = 0; i <= timeout; i++) {
        var tmpUrl = yield driver.getCurrentUrl();
        if (tmpUrl != waitUrl) {
          yield Promise.delay(1000);
        } else {
          yield Promise.resolve();
        }
      }
    }),

    scrollByPages: Promise.coroutine(function * (num_pages) {
      for (var i = 0; i < num_pages; i++) {
        yield driver.executeScript('window.scrollBy(0, window.innerHeight)');
        yield this.sleep(0.250);
      }
    }),

    scrollIntoView: Promise.coroutine(function * (selector) {
      var locator = this._locator(selector);
      yield driver.executeScript('arguments[0].scrollIntoView()', locator);
    }),

    switchFrame: Promise.coroutine(function * (selector) {
      yield driver.switchTo().frame(selector);
    }),

    /* ----- */

    _click: Promise.coroutine(function * (locator) {
      yield this._exists(true, locator);
      yield driver.findElement(locator).click();
    }),

    _exists: Promise.coroutine(function * (should_exist, locator, timeout) {
      var tick = Promise.coroutine(function * tick () {
        var element = yield driver.findElement(locator);
        var displayed = yield element.isDisplayed();
        return (should_exist === displayed);
      });

      function poll () {
        return tick().catch(function (e) {
          switch (e.name) {
            case 'NoSuchElementError':
              return !should_exist;
            case 'StaleElementReferenceError':
              return false;
            default:
              throw e;
          }
        });
      }

      var name;
      for (var key in locator) {
        name = locator[key];
      }
      var message = (should_exist ? `Element '${name}' is not present.` : `Element '${name}' is present.`);
      yield driver.wait(poll, (timeout || config.timeout), message);
    }),

    _locator: function (selector) {
      if (selector.startsWith('/')) {
        return { xpath: selector };
      } else {
        return { css: selector };
      }
    }
  };
};
