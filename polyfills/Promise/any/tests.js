
/* globals proclaim, Promise */

it('is a function', function () {
	proclaim.isFunction(Promise.any);
});

it('has correct arity', function () {
	proclaim.arity(Promise.any, 1);
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(Promise, 'any');
});

describe('any', function () {
	it("resolves to the first fulfilled promise when passed an array", function () {
		var promises = [Promise.reject(1), Promise.resolve(2), 3];
		return Promise.any(promises).then(function (result) {
			proclaim.strictEqual(result, 2);
		});
	});

	it("rejects with an AggregateError when passed an array of rejected promises", function () {
		var promises = [Promise.reject(1)];
		return Promise.any(promises)['catch'](function (err) {
			return err;
		}).then(function (err) {
			proclaim.equal(err.name, 'AggregateError');
			proclaim.deepStrictEqual(err.errors, [1]);
		});
	});

	it("rejects with an AggregateError when passed an empty array", function () {
		return Promise.any([])['catch'](function (err) {
			return err;
		}).then(function (err) {
			proclaim.equal(err.name, 'AggregateError');
			proclaim.deepStrictEqual(err.errors, []);
		});
	});

	if ('values' in Array.prototype) {
		it("resolves to the first fulfilled promise when passed an iterable", function () {
			var promises = [Promise.reject(1), Promise.resolve(2), 3];
			return Promise.any(promises.values()).then(function (result) {
				proclaim.strictEqual(result, 2);
			});
		});

		it("rejects with an AggregateError when passed an iterable of rejected promises", function () {
			var promises = [Promise.reject(1)];
			return Promise.any(promises.values())['catch'](function (err) {
				return err;
			}).then(function (err) {
				proclaim.equal(err.name, 'AggregateError');
				proclaim.deepStrictEqual(err.errors, [1]);
			});
		});

		it("rejects with an AggregateError when passed an empty iterable", function () {
			return Promise.any([].values())['catch'](function (err) {
				return err;
			}).then(function (err) {
				proclaim.equal(err.name, 'AggregateError');
				proclaim.deepStrictEqual(err.errors, []);
			});
		});
	}

	it("throws an error for input that is not iterable", function () {
		return Promise.any(0)['catch'](function (err) {
			return err;
		}).then(function (err) {
			proclaim.include(err.message, 'is not iterable');
		});
	});
});
