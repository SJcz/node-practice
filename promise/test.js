const promisesAplusTests = require('promises-aplus-tests')
const Promise = require('./promiseA+')

promisesAplusTests(Promise, function (err) {
	// All done; output is in the console. Or check `err` for number of failures.
	console.log(err)
})