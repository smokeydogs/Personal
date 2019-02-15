var selenium = require("../../support/selenium.js");
var Suite = require("../../support/suite.js");
var page = require("../page/_master_object.js");
var Promise = require("bluebird");
var expect = require("chai").expect;

Suite.UI("Generic Test", function() {

    it("Should display the banner and associated links", Promise.coroutine(function*() {
        var qa = new selenium(this.driver);

        yield qa.exists(page.home.header.master);
        yield qa.linkExists(page.home.header.card_category);
        yield qa.linkExists(page.home.header.card_issuer);
        yield qa.linkExists(page.home.header.credit_range);
        yield qa.linkExists(page.home.header.resources);
    }));

    it("Should redirect the user to a questionnaire when recommendations button is clicked", Promise.coroutine(function*() {
        var qa = new selenium(this.driver);

        yield qa.mouse(page.home.header.card_category);
        yield qa.clickLink(page.home.card_category.best_credit_cards);
        yield qa.exists(page.home.card_category.card_list);
    }));

});
