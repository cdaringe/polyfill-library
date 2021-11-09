
/* globals proclaim, AggregateError */

it('is a function', function () {
	proclaim.isFunction(AggregateError);
});

if ('getPrototypeOf' in Object) {
	it('has a prototype of Error', function () {
		proclaim.deepStrictEqual(Object.getPrototypeOf(AggregateError), Error);
	});
}

describe('AggregateError', function () {
	it("constructs an AggregateError when passed an array", function () {
		var errors = [new Error('x'), new Error('y')];
		var aggregateError = new AggregateError(errors);
		proclaim.equal(aggregateError.name, 'AggregateError');
		proclaim.equal(aggregateError.message, '');
		proclaim.deepStrictEqual(aggregateError.errors, errors);
	});

	it("constructs an AggregateError when passed an array and message", function () {
		var errors = [new Error('x'), new Error('y')];
		var aggregateError = new AggregateError(errors, 'z');
		proclaim.equal(aggregateError.message, 'z');
		proclaim.deepStrictEqual(aggregateError.errors, errors);
	});

	if ('values' in Array.prototype) {
		it("constructs an AggregateError when passed an iterable", function () {
			var errors = [new Error('x'), new Error('y')];
			var aggregateError = new AggregateError(errors.values());
			proclaim.equal(aggregateError.message, '');
			proclaim.deepStrictEqual(aggregateError.errors, errors);
		});
	}

	it("throws an error for input that is not iterable", function () {
		proclaim['throws'](function () {
			new AggregateError(0)
		});
	});
});
