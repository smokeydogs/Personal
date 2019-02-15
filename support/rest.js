const Promise = require("bluebird");
const config = require("../config.js");
const rp = require("request-promise");
const _ = require('lodash');


/***
 *  @ url        REST endpoint for communication
 *  @ method     GET, POST, PUT, DELETE
 *  @ payload    data sent for POST calls
 *  @ headers    REST headers used by the endpoint
 ***/
let connect = Promise.coroutine(function*(url, method, payload, headers) {
  let options = yield this.options(url, method, payload, headers);

  let response = yield rp(options);
  return response;
});

let customConnect: Promise.coroutine(function*(options) {
  let response = yield rp(options);
  return response;
});

/***
 * Request option builder
 ***/
let options = Promise.coroutine(function*(url, method, payload, headers) {
  let options = {
    uri: url,
    method: method,
    headers: headers || config.headers,
    json: true,
    resolveWithFullResponse: true,
    timeout: config.timeout,
    simple: false
  };
  if (payload != null) {
    options = _.merge(options, {
      "body": payload
    });
  }
  return Promise.resolve(options);
});

/***
 * Poll for successful completion of a system action
 ***/
let poll = function(url, check, objects, timeout) {
  let self = this;

  let poll_ = Promise.coroutine(function* poll_() {
    let response;
    do {
      yield Promise.delay(1000);
      response = yield self.connect(url, "GET", objects);
    } while (!check(response.body) && !result.isRejected());
  });
  let result = poll_().timeout(timeout || config.timeout, `Polling of '${url}' timed out.`);
  return result;
};


module.exports = {
  connect: connect,
  customConnect: customConnect,
  options: options,
  poll: poll
}

};
