/* eslint-env mocha, browser */
// eslint-disable-next-line no-unused-vars
/* globals proclaim */
// Tests adapted from: https://github.com/javan/details-element-polyfill/blob/main/test/index.js

const STATIC_HTML =
	"<details id='static-details'>" +
	"<summary id='static-summary'>Summary</summary>" +
	"<div id='static-content'>Content</div>" +
	"</details>";

const DYNAMIC_HTML =
	"<div id='container'>" +
	"<details id='details'>" +
	"<summary id='summary'>Summary</summary>" +
	"<div id='content'>Content</div>" +
	"</details>" +
	"</div>";

const detailsElementIsNative = typeof HTMLDetailsElement != "undefined";

describe("Details", function () {
	before(function () {
		document.body.insertAdjacentHTML("beforeend", STATIC_HTML);
	});
	beforeEach(function () {
		document.body.insertAdjacentHTML("beforeend", DYNAMIC_HTML);
	});

	afterEach(function () {
		document.body.removeChild(document.getElementById("container"));
	});

	it("displays summary and hides content initially", function () {
		proclaim.notEqual(getElement("summary").offsetHeight, 0);
		proclaim.equal(getElement("content").offsetHeight, 0);
	});

	it('<summary id="static-summary"> is focusable', function (done) {
		const summary = getElement("static-summary");
		defer(function () {
			// setTimeout() and done() required for IE11
			if (!detailsElementIsNative) {
				proclaim.isTrue(summary.hasAttribute("tabindex"));
				proclaim.isTrue(summary.hasAttribute("role"));
			}
			summary.focus();
			proclaim.equal(document.activeElement, summary);
			done();
		});
	});

	it('<summary id="summary"> is focusable', function (done) {
		const summary = getElement("summary");
		defer(function () {
			if (!detailsElementIsNative) {
				proclaim.isTrue(summary.hasAttribute("tabindex"));
				proclaim.isTrue(summary.hasAttribute("role"));
			}
			summary.focus();
			proclaim.equal(document.activeElement, summary);
			done();
		});
	});

	// it('<summary id="summary"> is focusable', function () {
	// 	const summary = getElement("summary");

	// 	if (!detailsElementIsNative) {
	// 		proclaim.equal(summary.hasAttribute("tabindex"), true);
	// 		proclaim.equal(summary.hasAttribute("role"), true);
	// 	}

	// 	summary.focus();

	// 	proclaim.equal(document.activeElement, summary);
	// });

	// it("open property toggles content", function () {
	// 	const element = getElement("details");
	// 	const summary = getElement("summary");
	// 	const content = getElement("content");

	// 	let toggleEventCount = 0;
	// 	element.addEventListener("toggle", function () {
	// 		return (toggleEventCount = toggleEventCount + 1);
	// 	});

	// 	element.open = true;

	// 	proclaim.equal(toggleEventCount, 1);
	// 	proclaim.notEqual(content.offsetHeight, 0);
	// 	proclaim.isTrue(element.hasAttribute("open"));
	// 	proclaim.isTrue(element.open);
	// 	if (!detailsElementIsNative) {
	// 		proclaim.equal(summary.getAttribute("aria-expanded"), "true");
	// 	}

	// 	element.open = false;

	// 	proclaim.equal(content.offsetHeight, 0);
	// 	proclaim.notOk(element.hasAttribute("open"));
	// 	proclaim.notOk(element.open);
	// 	if (!detailsElementIsNative) {
	// 		proclaim.equal(summary.getAttribute("aria-expanded"), "false");
	// 	}

	// 	proclaim.equal(toggleEventCount, 2);
	// });

	// it("open attribute toggles content", function () {
	// });

	// it("click <summary> toggles content", function () {
	// });

	// it("click <summary> child toggles content", function () {
	// });

	// it("toggle event does not bubble", function () {
	// });
});

function getElement(id) {
	return document.getElementById(id);
}

function defer(callback) {
	setTimeout(callback, 30);
}

function clickElement(element, callback) {
	let event;
	try {
		event = new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true
		});
	} catch (error) {
		event = document.createEvent("MouseEvents");
		event.initEvent("click", true, true);
	}
	element.dispatchEvent(event);
	defer(callback);
}
