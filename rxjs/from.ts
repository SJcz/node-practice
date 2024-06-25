// 基于以上的 MyObservable 和 SafeObserver, 实现的部分 rxjs 的函数
import { MyObservable, SafeObserver } from './rxjs'

// from: 提供一个数组, 每隔0.1s生成一个数组中元素的 observable
export function from<T>(arr: T[]) { 
	return new MyObservable((observer: SafeObserver) => { 
		let i = 0
		const intercalId = setInterval(() => { 
			if (i >= arr.length) { 
				observer.complete()
				clearInterval(intercalId)
			}
			observer.next(arr[i++])
		}, 100)
	
		return () => { 
			clearInterval(intercalId)
		}
	})
}

//  test
if (require.main === module) { 
	const observer = {
		next: data => console.log('from data', data),
		complete: () => console.log('from complete'),
		error: (e) => console.log(e),
	}
	
	from([1, 2, 3, 4, 5]).subscribe(observer)
}
