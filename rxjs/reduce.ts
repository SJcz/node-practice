// 基于以上的 MyObservable 和 SafeObserver, 实现的部分 rxjs 的函数
import assert from 'assert'
import { MyObservable, Observer, SafeObserver } from './rxjs'

// reduce: 提供一个可观察对象和一个包装函数, 可观察对象生产的每一个数据, 经过包装函数处理暂存, 只有可观察对象结束时,  才会将暂存得值提供给观察者
export function reduce(observable: MyObservable, project: (cur: any, data: any) => any, init?: any) { 
	return new MyObservable((observer: Observer) => { 
		let cur = init || 0
		return observable.subscribe({
			next: data => { 
				cur = project(cur, data)
				observer.next(cur)
			},
			complete: () => { 
				observer.complete()
			},
			error: e => observer.error(e)
		})
	})
}

//  test, 被引入时不执行
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
	
	const finalResult = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55]
	let resultIdx = 0
	const observer = {
		next: data => {
			console.log('map data', data)
			assert.equal(data, finalResult[resultIdx++])
		},
		complete: () => console.log('map complete'),
		error: (e) => console.log(e),
	}
	
	reduce(observable, (cur: number, data: number) => { 
		cur += data
		return cur
	}).subscribe(observer)
} 

