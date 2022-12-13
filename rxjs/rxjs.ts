export type Observer = {
	next?: (data: any) => void
	error?: (e: any) => void
	complete?: () => void
}


/**
 * observer 对象一般只提供三个函数, next, complete, error
 * 为了让 observer 更加健壮, 需要对其进行包装, 也就是 SafeObserver
 */
class SafeObserver {
	/**观察者对象 */
	private observer: Observer
	/**是否取消订阅了 */
	private isUnsubscribe: boolean
	/**取消订阅时的回调函数 */
	public onsub?: () => void

	constructor(observer: Observer) { 
		this.observer = observer
		this.isUnsubscribe = false
	}
  
	next(data) { 
		if (this.isUnsubscribe) return
		if (this.observer.next) { 
			this.observer.next(data)
		}
	}
  
	error(e) { 
		if (this.isUnsubscribe) return
		if (this.observer.error) { 
			this.observer.error(e)
		}
		this.unsubscribe()
	}

	complete() { 
		if (this.isUnsubscribe) return
		if (this.observer.complete) { 
			this.observer.complete()
		}
		this.unsubscribe()
	}

	unsubscribe() { 
		this.isUnsubscribe = true
		if (this.onsub) this.onsub()
	}
}

{ 
	// 简单的 observable 函数实现
	function simpleObervable(observer: Observer) { 
		if (typeof observer === 'function') observer = { next: observer }
		const safeObserver = new SafeObserver(observer)
		
		let i = 0
		const intercalId = setInterval(() => { 
			if (i > 10) { 
				safeObserver.complete()
				clearInterval(intercalId)
			}
			safeObserver.next(i++)
		}, 100)
	
		safeObserver.onsub = () => { 
			clearInterval(intercalId)
		}
	
		return () => { 
			safeObserver.unsubscribe()
		}
	}
	
	const unsubHandle = simpleObervable({
		next: (data) => console.log('data', data),
		complete: () => console.log('complete'),
		error: () => console.log('error'),
	})
	
	setTimeout(() => { 
		unsubHandle()
	}, 500)
}

/**
 * observalble 可以再更适用一点, 使用类来定义
 * 可观察对象的核心是提供数据, 调用观察者的 next 函数来向观察者提供数据.
 * 因此该类的核心是提供数据的函数 howTowProduceData
 * 该函数需要返回一个
 */
export class MyObservable { 
	// 核心, 如何生产数据的函数, 这个函数里面需要生产数据给观察者使用
	private howTowProduceData: (observer: Observer) => () => void
	
	constructor(howTowProduceData: (observer: Observer) => () => void) { 
		this.howTowProduceData = howTowProduceData
	}

	subscribe(observer: Observer) { 
		if (typeof observer === 'function') observer = { next: observer }
		const safeObserver = new SafeObserver(observer)
		safeObserver.onsub = this.howTowProduceData(observer)

		return () => { 
			safeObserver.unsubscribe()
		}
	}
}




