import { Graph_邻接矩阵表示 } from './图结构表示'

const MAX_DIS = 65535

export function 最短路径Dijkstra(g: Graph_邻接矩阵表示) {
	const p = []
	const d = []
	const final = [] // 记录哪些节点已经找到了最短路径  V0开始
	for(let i = 0; i < g.pointNum; i++) {
		final[i] = 0
		d[i] = g.vers[0][i]
		p[i] = 0
	}
	final[0] = 1 // 初始顶点已经找到最短路径了

	for(let i = 1; i < g.pointNum; i++) { // 找每一个顶点的最短路径
		let min = MAX_DIS
		let k = 0
		for (let j = 0; j < g.pointNum; j++) { // 找制定顶点相连的最短的顶点
			if (!final[j] && d[j] < MAX_DIS) {
				min = d[j]
				k = j
			}
		}

		final[k] = 1

		for (let j = 0; j < g.pointNum; j++) {
			if (!final[j] && (min + g.vers[k][j]) < d[j]) {
				d[j] = min + g.vers[k][j]
				p[j] = k
			}
		}
	}
}