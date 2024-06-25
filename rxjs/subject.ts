import { Observer, SafeObserver } from './rxjs'

export class Subject {
	observer: SafeObserver 
	observer_list: SafeObserver[]
	constructor() { 
		this.observer = new SafeObserver({
			next: (data: any) => { 
				for (const ob of this.observer_list) {
					ob.next(data)
				}
			}
		})
	}

	next(data: any) { 
		this.observer.next(data)
	}
  
	subscribe(observer: Observer) { 
		this.observer_list.push(new SafeObserver(observer))
	}
}