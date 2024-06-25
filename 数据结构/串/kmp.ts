// KMP 字符串匹配模式

// 核心是求解子串 T 的前后缀相似度
// next[j] = 0; when j = 1, 第 1 个字符不相等时, j 的变化
// next[j] = Max[k]; when 1 < k < j 时, 存在 n(1) ~ n(k - 1) == n(j - k + 1) ~ n(j -1)
// next[j] = 1; 其他情况

// 核心是求解 next 数组, next 中从 0 开始计算

function generateNext(t: string) {
	const next = [-1, 0]
	let top = 0 // 前缀指针 每次比较从0开始
	let bottom = 1 // 后缀指针
	while(bottom < t.length) {
		if (top === -1 || t.charAt(top) === t.charAt(bottom)) {
			top++
			bottom++
			if (t.charAt(top) !== t.charAt(bottom)) {
				next[bottom] = top
			} else {
				next[bottom] = next[top] // 优化
			}
		} else {
			top = next[top]
		}
	}
	return next
}

function index_kmp(s: string, t: string) {
	if (t.length > s.length) return -1
	const next = generateNext(t)
	let top = 0 // 主串的字符指针
	let bottom = 0 // 子串 t 的字符指针
	while(top < s.length - t.length + 1 && bottom < t.length) {
		if (bottom == -1 || s.charAt(top) === t.charAt(bottom)) {
			top++
			bottom++
		} else {
			bottom = next[bottom]
		}
	}
	if (bottom === t.length) {
		return top - bottom
	}
	return -1
}

function index_kmp_改良(s: string, t: string) {
	if (t.length > s.length) return -1
	const next = generateNext(t)
	let top = 0 // 主串的字符指针
	let bottom = 0 // 子串 t 的字符指针
	while(top < s.length - t.length + 1 && bottom < t.length) {
		if (bottom == -1 || s.charAt(top) === t.charAt(bottom)) {
			top++
			bottom++
		} else {
			bottom = next[bottom]
			while(bottom !== -1 && t.charAt(bottom) === t.charAt(next[bottom])) {
				bottom = next[bottom]
			}
		}
	}
	if (bottom === t.length) {
		return top - bottom
	}
	return -1
}

console.log(generateNext('ababaaaba'))

console.log(index_kmp('ababaaaba', 'abaa'))