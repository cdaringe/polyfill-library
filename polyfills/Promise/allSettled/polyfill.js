/* global CreateMethodProperty, GetIterator, Promise, Type */
(function () {
	// Based on https://github.com/es-shims/Promise.allSettled/blob/main/implementation.js

	CreateMethodProperty(Promise, 'allSettled', function allSettled (iterable) {
		var C = this;
		if (Type(C) !== 'Object') {
			throw new TypeError('`this` value must be an object');
		}

		var arr = Array.isArray(iterable) ? iterable : Array.from(GetIterator(iterable))

		var promises = arr.map(function (promise) {
			var onFulfill = function (value) {
				return { status: 'fulfilled', value: value };
			};
			var onReject = function (reason) {
				return { status: 'rejected', reason: reason };
			};
			var itemPromise = C.resolve(promise);
			try {
				return itemPromise.then(onFulfill, onReject);
			} catch (e) {
				return C.reject(e);
			}
		});

		return C.all(promises);
	});
}());
