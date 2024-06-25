// 基于以上的 MyObservable 和 SafeObserver, 实现的部分 rxjs 的函数
import { reduce } from './reduce'
import { MyObservable, SafeObserver } from './rxjs'


//  test
if (require.main === module) { 
	const observable =  MyObservable.create((observer: SafeObserver) => { 
		let i = 0
		const intervalId = setInterval(() => { 
			if (i > 10) { 
				observer.complete()
			}
			observer.next(i++)
		}, 100)
		
		return () => { 
			clearInterval(intervalId)
		}
	})
	
	const observer = {
		next: data => console.log('map data', data),
		complete: () => console.log('map complete'),
		error: (e) => console.log(e),
	}
	
	reduce(observable, (cur: number, data: number) => { 
		cur += data
		return cur
	}).subscribe(observer)
}
