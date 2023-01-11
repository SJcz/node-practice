type ElementType = number

type node = {
  data: ElementType,
  next: node
}


/**
 * 线性表 - 链式存储
 */
class MyList_List { 
	/**指向头节点 */
	next: node
	/**线性表的长度, 有效元素的个数 */
	length: number 

	constructor() { 
		this.next = null
		this.length = 0
	}
  
	static initList() { 
		return new MyList_List()
	}
  
	listEmpty() { 
		return this.length === 0
	}

	clearList() { 
		this.next = null
		this.length = 0
	}

	getElem(i: number) { 
		if (i >= this.length || i < 0) return null
		let j = 0
		let node = this.next
		while (j < i && node) { 
			node = node.next
			j++
		}
		if (!node) return null
		return node
	} 

	locateElem() { 

	}

	listInsert(i: number, value: ElementType) { 
		if (i < 0 || i > this.length) return null
		if (i == 0) {
			const q = this.next
			this.next = {
				data: value,
				next: q
			}
		} else { 
			const preNode = this.getElem(i - 1)
			const q = preNode.next
			preNode.next = {
				data: value,
				next: q
			}
		}
		this.length++
		return 'OK'
	}

	listDelete(i: number) { 
		if (this.length === 0) return
		if (i < 0 || i >= this.length) return
		if (i == 0) {
			this.next = this.next.next
		} else { 
			const preNode = this.getElem(i - 1)
			preNode.next = preNode.next.next
		}
		this.length--
		return 'OK'
	}

	listLength() { 
		return this.length
	}
}