const MAX_QUEUE_SIZE = 10


/**
 * 队列, 线性表存储结构
 * rear == front 时, 认为队列为空
 */
class Queue_Array {
	/**指向队列头元素 */
	rear: number
	/**指向队列尾元素的后一个元素 */
	front: number
	data: number[]

	constructor() {
		this.rear = 0
		this.front = 0
		this.data = []
	}

	static initQueue() {
		return new Queue_Array()
	}

	queueLength() {
		// rear 小于 front 时, 长度分为两部分 MAX_QUEUE_SIZE - front 和 rear
		// rear 大于 front 时, 长度为 rear - front
		return (this.rear - this.front + MAX_QUEUE_SIZE) % MAX_QUEUE_SIZE 
	}

	enQueue(item: number) {
		// 空队列时  rear == fonrt, 满队列时, rear == fonrt
		// 为了避免额外判断, 索性保留一个元素空间, 也就是还有一个空闲单元时, 就认为队列已满
		if ((this.rear + 1) % MAX_QUEUE_SIZE === this.front) return // 队列满了
		this.data[this.rear] = item
		this.rear = (this.rear + 1) % MAX_QUEUE_SIZE
	}

	deQueue() {
		if (this.rear === this.front) return // 空队列
		const item = this.data[this.front]
		this.front = (this.front + 1) % MAX_QUEUE_SIZE
		return item
	}
}