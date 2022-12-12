const PENGING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'

class PromiseA {
	private _status: string
	private _data: any
	private _onFullfiledCallbacks: any[]
	private _unRejectedCallbacks: any[]

	constructor(cb: any) {
		this._status = PENGING
		this._data = undefined
		this._onFullfiledCallbacks = []
		this._unRejectedCallbacks = []
		cb.call(null, this._resolve.bind(this), this._reject.bind(this))
	}

	_resolve(data) {
		if (this._status !== PENGING) return
		this._status = FULLFILLED
		this._data = data
		for (const callback of this._onFullfiledCallbacks) {
			callback(this._data)
		}
	}

	_reject(error) {
		if (this._status !== PENGING) return
		this._status = REJECTED
		this._data = error
		for (const callback of this._unRejectedCallbacks) {
			callback(this._data)
		}
	}

	then(fullfilledCb, rejectedCb) {
		if (typeof fullfilledCb !== 'function') fullfilledCb = (data) => data
		if (typeof rejectedCb !== 'function') rejectedCb = (error) => { throw error }
		const newPromose = new PromiseA((resolve, reject) => {
			if (this._status === FULLFILLED) {
				try {
					const result = fullfilledCb(this._data)
					resolvePromise(result, newPromose, resolve, reject)
				} catch (e) {
					reject(e)
				}
			}
			if (this._status === REJECTED) {
				try {
					const result = rejectedCb(this._data)
					resolvePromise(result, newPromose, resolve, reject)
				} catch (e) {
					reject(e)
				}
			}
			if (this._status === PENGING) {
				this._onFullfiledCallbacks.push((data) => {
					try {
						const result = fullfilledCb(data)
						resolvePromise(result, newPromose, resolve, reject)
					} catch (e) {
						reject(e)
					}
				})
				this._unRejectedCallbacks.push((data) => {
					try {
						const result = rejectedCb(data)
						resolvePromise(result, newPromose, resolve, reject)
					} catch (e) {
						reject(e)
					}
				})
			}
		})

		return newPromose
	}
}

function resolvePromise(x, y, resolve, reject) {
	if (x === y) {
		throw new Error('x === y')
	}
	if (x instanceof PromiseA) {
		// return x.then()
	}
}

