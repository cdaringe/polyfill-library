/* global AggregateError, CreateMethodProperty, GetIterator, Promise, Type */
(function () {
	// Based on https://github.com/es-shims/Promise.any/blob/master/implementation.js

	var identity = function (x) {
		return x;
	}

	CreateMethodProperty(Promise, 'any', function any (iterable) {
		var C = this;
		if (Type(C) !== 'Object') {
			throw new TypeError('`this` value must be an object');
		}

		var arr = Array.isArray(iterable) ? iterable : Array.from(GetIterator(iterable))

		var thrower = function (value) {
			return C.reject(value);
		};

		var promises = arr.map(function (promise) {
			var itemPromise = C.resolve(promise);
			try {
				return itemPromise.then(thrower, identity);
			} catch (e) {
				return e;
			}
		});

		return C.all(promises).then(function (errors) {
			throw new AggregateError(errors, 'Every promise rejected')
		}, identity);
	});
}());
