const PENGING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'
class PromiseA {
	constructor(cb) {
		this._status = PENGING
		this._data = undefined
		this._onFullfiledCallbacks = []
		this._unRejectedCallbacks = []
		try {
			cb.call(null, this._resolve.bind(this), this._reject.bind(this))
		}
		catch (e) {
			this._reject(e)
		}
	}
	_resolve(data) {
		process.nextTick(() => {
			if (data instanceof PromiseA) {
				data.then(this._resolve.bind(this), this._reject.bind(this))
			}
			if (this._status !== PENGING)
				return
			this._status = FULLFILLED
			this._data = data
			for (const callback of this._onFullfiledCallbacks) {
				callback(this._data)
			}
		})
	}
	_reject(error) {
		process.nextTick(() => {
			if (this._status !== PENGING)
				return
			this._status = REJECTED
			this._data = error
			for (const callback of this._unRejectedCallbacks) {
				callback(this._data)
			}
		})
	}
	then(fullfilledCb, rejectedCb) {
		if (typeof fullfilledCb !== 'function')
			fullfilledCb = (data) => data
		if (typeof rejectedCb !== 'function')
			rejectedCb = (error) => { throw error }
		const newPromise = new PromiseA((resolve, reject) => {
			if (this._status === FULLFILLED) {
				process.nextTick(() => {
					try {
						const x = fullfilledCb(this._data)
						resolvePromise(newPromise, x, resolve, reject)
					}
					catch (e) {
						reject(e)
					}
				})
			}
			if (this._status === REJECTED) {
				process.nextTick(() => {
					try {
						const x = rejectedCb(this._data)
						resolvePromise(newPromise, x, resolve, reject)
					}
					catch (e) {
						reject(e)
					}
				})
			}
			if (this._status === PENGING) {
				this._onFullfiledCallbacks.push((data) => {
					try {
						const x = fullfilledCb(data)
						resolvePromise(newPromise, x, resolve, reject)
					}
					catch (e) {
						reject(e)
					}
				})
				this._unRejectedCallbacks.push((data) => {
					try {
						const x = rejectedCb(data)
						resolvePromise(newPromise, x, resolve, reject)
					}
					catch (e) {
						reject(e)
					}
				})
			}
		})
		return newPromise
	}
}
function resolvePromise(newPromise, x, resolve, reject) {
	if (x === newPromise) {
		return reject(new TypeError('x === newPromise'))
	}
	if (x instanceof PromiseA) {
		// return x.then()
		return x.then((y) => {
			resolvePromise(newPromise, y, resolve, reject)
		}, reject)
	}
	let hasCalled = false
	if (x != null && (typeof x === 'function' || typeof x === 'object')) {
		try {
			const then = x.then
			if (typeof then === 'function') {
				then.call(x, function (y) {
					if (hasCalled)
						return
					hasCalled = true
					resolvePromise(newPromise, y, resolve, reject)
				}, function (e) {
					if (hasCalled)
						return
					hasCalled = true
					reject(e)
				})
			}
			else {
				resolve(x)
			}
		}
		catch (e) {
			if (hasCalled)
				return
			hasCalled = true
			reject(e)
		}
	}
	else {
		resolve(x)
	}
}

PromiseA.deferred = PromiseA.defer = function () {
	var dfd = {}
	dfd.promise = new PromiseA(function (resolve, reject) {
		dfd.resolve = resolve
		dfd.reject = reject
	})
	return dfd
}

module.exports = PromiseA
