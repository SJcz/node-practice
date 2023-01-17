function sequen_find(arr: number[], key: number) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === key) return i
	}
	return -1
}

function 顺序表查找_优化(arr: number[], key: number) {
	let i = 0
	arr[arr.length] = key
	while(arr[i] !== key) {
		i++
	}
	return i == arr.length ? -1 : i
}

const testArr = []
for (let i = 0; i < 100000000; i++) {
	testArr.push(i)
}

const random = Math.floor(Math.random() * 100000000)
console.log(random)

console.time('顺序表查找')
console.log(sequen_find(testArr, random))
console.timeEnd('顺序表查找')

console.time('顺序表查找_优化')
console.log(顺序表查找_优化(testArr, random))
console.timeEnd('顺序表查找_优化')


/**
 * 只针对有序数组的二分法
 * 假设数组从小到大
 * @param arr 
 * @param key 
 */
function 二分法(arr: number[], key: number) {
	let left = 0
	let right = arr.length
	while (left <= right) {
		const mid = Math.floor((left + right) / 2)
		if (arr[mid] > key) {
			right = mid - 1
		} else if (arr[mid] < key) {
			left = mid + 1
		} else {
			return mid
		}
	}

	return -1
}

/**
 * 查英文字典， 'apple' 从头开始找, 'zoo' 从尾巴开始找, 而肯定不会从中间开始二分查找
 * 基于这个原理, 均匀分布的有序数据, 二分法还有优化空间 
 * 基于要查找的值在数组的范围比例, 修改 mid 的计算公式
 * 
 */
function 二分法优化_插值查找(arr: number[], key: number) {
	let left = 0
	let right = arr.length
	while (left <= right) {
		const mid = left + Math.floor(((key - arr[left]) / (arr[right] - arr[left])) * (right - left))
		if (arr[mid] > key) {
			right = mid - 1
		} else if (arr[mid] < key) {
			left = mid + 1
		} else {
			return mid
		}
	}

	return -1
}

