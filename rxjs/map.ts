// 基于以上的 MyObservable 和 SafeObserver, 实现的部分 rxjs 的函数
import { MyObservable, Observer, SafeObserver } from './rxjs'

// map: 提供一个可观察对象和一个包装函数, 可观察对象生产的每一个数据, 经过包装函数, 再提供给观察者
export function map(observable: MyObservable, project: (data: any) => any) { 
	return new MyObservable((observer: Observer) => { 
		return observable.subscribe({
			next: data => observer.next(project(data)),
			complete: () => observer.complete(),
			error: e => observer.error(e)
		})
	})
}

//  test
if (require.main === module) { 
	const observable = new MyObservable((observer: SafeObserver) => { 
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
	
	map(observable, (i: number) => i * 10).subscribe(observer)
}
