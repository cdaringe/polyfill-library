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

	it("open property toggles content", function (done) {
		const element = getElement("details");
		const summary = getElement("summary");
		const content = getElement("content");

		let toggleEventCount = 0;
		element.addEventListener("toggle", function () {
			toggleEventCount++;
		});

		defer(function () {
			element.open = true;
			defer(function () {
				proclaim.equal(toggleEventCount, 1);
				proclaim.notEqual(content.offsetHeight, 0);
				proclaim.ok(element.hasAttribute("open"));
				proclaim.ok(element.open);
				if (!detailsElementIsNative) {
					proclaim.equal(summary.getAttribute("aria-expanded"), "true");
				}

				element.open = false;
				defer(function () {
					proclaim.equal(content.offsetHeight, 0);
					proclaim.notOk(element.hasAttribute("open"));
					proclaim.notOk(element.open);
					if (!detailsElementIsNative) {
						proclaim.equal(summary.getAttribute("aria-expanded"), "false");
					}
					defer(function () {
						proclaim.equal(toggleEventCount, 2);
						done();
					});
				});
			});
		});
	});

	it("open attribute toggles content", function (done) {
		const element = getElement("details");
		const summary = getElement("summary");
		const content = getElement("content");

		let toggleEventCount = 0;
		element.addEventListener("toggle", function () {
			toggleEventCount++;
		});

		defer(function () {
			element.setAttribute("open", "");
			defer(function () {
				proclaim.equal(toggleEventCount, 1);
				proclaim.notEqual(content.offsetHeight, 0);
				if (!detailsElementIsNative) {
					proclaim.equal(summary.getAttribute("aria-expanded"), "true");
				}

				element.removeAttribute("open");
				defer(function () {
					proclaim.equal(toggleEventCount, 2);
					proclaim.equal(content.offsetHeight, 0);
					if (!detailsElementIsNative) {
						proclaim.equal(summary.getAttribute("aria-expanded"), "false");
					}
					done();
				});
			});
		});
	});

	it("click <summary> toggles content", function (done) {
		const element = getElement("details");
		const summary = getElement("summary");
		const content = getElement("content");

		let toggleEventCount = 0;
		element.addEventListener("toggle", function () {
			toggleEventCount++;
		});

		defer(function () {
			clickElement(summary, function () {
				proclaim.equal(toggleEventCount, 1);
				proclaim.notEqual(content.offsetHeight, 0);
				proclaim.ok(element.hasAttribute("open"));
				if (!detailsElementIsNative) {
					proclaim.equal(summary.getAttribute("aria-expanded"), "true");
				}

				clickElement(summary, function () {
					proclaim.equal(toggleEventCount, 2);
					proclaim.equal(content.offsetHeight, 0);
					proclaim.notOk(element.hasAttribute("open"));
					if (!detailsElementIsNative) {
						proclaim.equal(summary.getAttribute("aria-expanded"), "false");
					}
					done();
				});
			});
		});
	});

	it("click <summary> child toggles content", function (done) {
		const element = getElement("details");
		const summary = getElement("summary");
		const content = getElement("content");

		const summaryChild = document.createElement("span");
		summary.appendChild(summaryChild);

		let toggleEventCount = 0;
		element.addEventListener("toggle", function () {
			toggleEventCount++;
		});

		defer(function () {
			clickElement(summaryChild, function () {
				proclaim.equal(toggleEventCount, 1);
				proclaim.notEqual(content.offsetHeight, 0);
				proclaim.ok(element.hasAttribute("open"));
				if (!detailsElementIsNative) {
					proclaim.equal(summary.getAttribute("aria-expanded"), "true");
				}

				clickElement(summaryChild, function () {
					proclaim.equal(toggleEventCount, 2);
					proclaim.equal(content.offsetHeight, 0);
					proclaim.notOk(element.hasAttribute("open"));
					if (!detailsElementIsNative) {
						proclaim.equal(summary.getAttribute("aria-expanded"), "false");
					}
					done();
				});
			});
		});
	});

	it("toggle event does not bubble", function (done) {
		const container = getElement("container");
		const element = getElement("details");

		let toggleEventCount = 0;
		element.addEventListener("toggle", function () {
			toggleEventCount++;
		});

		let bubbledToggleEventCount = 0;
		container.addEventListener("toggle", function () {
			bubbledToggleEventCount++;
		});

		element.open = true;
		defer(function () {
			proclaim.equal(toggleEventCount, 1);
			proclaim.equal(bubbledToggleEventCount, 0);

			element.open = false;
			defer(function () {
				proclaim.equal(toggleEventCount, 2);
				proclaim.equal(bubbledToggleEventCount, 0);
				done();
			});
		});
	});
});

function getElement(id) {
	return document.getElementById(id);
}

// setTimeout() and done() REQUIRED for IE11
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
