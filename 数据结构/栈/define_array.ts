const MAX_STACK_SIZE = 10

class Stack_Array { 
	top: number
	data: number[]

	constructor() { 
		this.top = -1
		this.data = []
	}

	push(item: number) { 
		if (this.top == MAX_STACK_SIZE - 1) return 'ERROR'
		this.top++
		this.data[this.top] = item
		return 'OK'
	}

	pop() { 
		if (this.top === -1) return 'ERROR'
		const item = this.data[this.top]
		this.top--
		return item
	}
}

class DoubleStack_Array { 
	/**左边栈的top */
	top1: number
	/**右边栈的top */
	top2: number
	data: number[]

	constructor() { 
		this.top1 = -1
		this.top2 = MAX_STACK_SIZE
		this.data = []
	}

	push(item: number, stackNum: number) { 
		if (this.top1 + 1 == this.top2) return 'ERROR'
		if (stackNum === 1) {
			this.top1++
			this.data[this.top1] = item
			return 'OK'
		} else { 
			this.top2--
			this.data[this.top2] = item
			return 'OK'
		}
	}

	pop(stackNum: number) { 
		if (stackNum === 1) {
			if (this.top1 === -1) return 'ERROR'
			const item = this.data[this.top1]
			this.top1--
			return item
		} else { 
			if (this.top2 === MAX_STACK_SIZE) return 'ERROR'
			const item = this.data[this.top2]
			this.top2++
			return item
		}
	}
}