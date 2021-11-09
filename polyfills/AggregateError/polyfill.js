/* global CreateDataPropertyOrThrow, GetIterator */
(function () {
	// Based on https://github.com/es-shims/AggregateError/blob/main/implementation.js

	function AggregateError (errors, message) {
		var error = new Error(message);
		Object.setPrototypeOf(error, AggregateError.prototype);
		delete error.constructor;

		var errorsList = Array.isArray(errors) ? errors : Array.from(GetIterator(errors));
		CreateDataPropertyOrThrow(error, 'errors', errorsList);

		return error;
	}

	Object.setPrototypeOf(AggregateError.prototype, Error.prototype);

	self.AggregateError = AggregateError;
}());
