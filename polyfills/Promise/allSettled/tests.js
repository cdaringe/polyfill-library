
/* globals proclaim, Promise */

it('is a function', function () {
	proclaim.isFunction(Promise.allSettled);
});

it('has correct arity', function () {
	proclaim.arity(Promise.allSettled, 1);
});

it('is not enumerable', function () {
	proclaim.isNotEnumerable(Promise, 'allSettled');
});

describe('allSettled', function () {
	it("resolves to an array of results when passed an array", function () {
		var promises = [1, Promise.resolve(2), Promise.reject(3)];
		return Promise.allSettled(promises).then(function (results) {
			proclaim.deepStrictEqual(results, [
				{
					status: 'fulfilled',
					value: 1
				},
				{
					status: 'fulfilled',
					value: 2
				},
				{
					status: 'rejected',
					reason: 3
				}
			]);
		});
	});

	if ('values' in Array.prototype) {
		it("resolves to an array of results when passed an iterable", function () {
			var promises = [1, Promise.resolve(2), Promise.reject(3)].values();
			return Promise.allSettled(promises).then(function (results) {
				proclaim.deepStrictEqual(results, [
					{
						status: 'fulfilled',
						value: 1
					},
					{
						status: 'fulfilled',
						value: 2
					},
					{
						status: 'rejected',
						reason: 3
					}
				]);
			});
		});
	}

	it("throws an error for input that is not iterable", function () {
		return Promise.allSettled(0)['catch'](function (err) {
			return err;
		}).then(function (err) {
			proclaim.include(err.message, 'is not iterable');
		});
	});
});
