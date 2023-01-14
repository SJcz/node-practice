import { Graph_边集数组表示, Graph_邻接矩阵表示 } from './图结构表示'

const MAX_DIS = 65535

/**
 * 思路：计算每一个顶点加入连接树的最小距离, 每次新的顶点加入, 更新每个顶点加入连接树的最小距离
 * @param graph 
 */
export function 最小生成树_普里姆算法(graph: Graph_邻接矩阵表示) {
	const lowcost = [0] // 每个顶点加入连接树的最小距离, 0 表示已加入
	const adjvex = [0] // 每个顶点加入连接树后和谁相连
	for (let i = 1; i < graph.pointNum; i++) {
		lowcost[i] = graph.vers[0][i]
		adjvex[i] = 0
	}

	// 顶点 0 已经加入的连接树

	for (let i = 1; i < graph.pointNum; i++) {
		let k = 0 // 当前可以加入连接树的最小距离的顶点
		let min = MAX_DIS

		for (let j = 1; j < graph.pointNum; j++) {
			if (lowcost[j] !== 0 && lowcost[j] < min) {
				min = lowcost[j]
				k = j
			}
		}

		console.log(k, adjvex[k]) // 打印已经连好的树

		lowcost[k] = 0 // 顶点 k 加入连接树

		// 新的节点加入树后, 需要更新剩下顶点加入树的最佳距离
		for (let j = 1; j < graph.pointNum; j++) {
			if (lowcost[j] !== 0 && graph.vers[k][j] < lowcost[j]) {
				lowcost[j] = graph.vers[k][j]
				adjvex[j] = k
			}
		}
	}

	return adjvex
}

const graph: Graph_邻接矩阵表示 = {
	pointNum: 9,
	points: [0, 1, 2, 3, 4, 5, 6, 7, 8],
	vers: [
		[0, 10, MAX_DIS, MAX_DIS, MAX_DIS, 11, MAX_DIS, MAX_DIS, MAX_DIS],
		[10, 0, 18, MAX_DIS, MAX_DIS, MAX_DIS, 16, MAX_DIS, 12],
		[MAX_DIS, MAX_DIS, 0, 22, MAX_DIS, MAX_DIS, MAX_DIS, MAX_DIS, 8],
		[MAX_DIS, MAX_DIS, 22, 0, 20, MAX_DIS, MAX_DIS, 16, 21],
		[MAX_DIS, MAX_DIS, MAX_DIS, 20, 0, 26, MAX_DIS, 7, MAX_DIS],
		[11, MAX_DIS, MAX_DIS, MAX_DIS, 26, 0, 17, MAX_DIS, MAX_DIS],
		[MAX_DIS, 16, MAX_DIS, MAX_DIS, MAX_DIS, 17, 0, 19, MAX_DIS],
		[MAX_DIS, MAX_DIS, MAX_DIS, 16, 7, MAX_DIS, 19, 0, MAX_DIS],
		[MAX_DIS, 12, 8, 21, MAX_DIS, MAX_DIS, MAX_DIS, MAX_DIS, 0],
	],
	verNum: 14
}

console.log(最小生成树_普里姆算法(graph))



export function 最小生成树_克鲁斯卡尔算法(g: Graph_边集数组表示) {
	const parent = [] // 表示顶点跟哪个顶点已经连通了, -1 表示未连通
	for (let i = 0; i < g.pointNum; i++) {
		parent[i] = -1
	}

	for (let i = 0; i < g.edges.length; i++) {
		const n = find(parent, g.edges[i].begin) // 找到这个顶点连通到的顶点
		const m = find(parent, g.edges[i].end)
		if (n !== m) {
			parent[n] = m // 顶点 n 和 m 连通了
			// 也就是选择这这条边
			console.log(g.edges[i])
		}
	}
}

function find(parent: number[], i: number) {
	while(parent[i] > -1) { // 跟哪个顶点连通了
		i = parent[i]
	}
	return i
}

function 邻接矩阵转边集数据(g: Graph_邻接矩阵表示) {
	const edges = []
	for (let i = 0; i < g.pointNum; i++) {
		for (let j = i + 1; j < g.pointNum; j++) {
			if (g.vers[i][j] < MAX_DIS) {
				edges.push({
					begin: i,
					end: j,
					weight: g.vers[i][j]
				})
			}
		}
	}

	return {
		points: g.points,
		pointNum: g.pointNum,
		edges: edges.sort((a, b) => a.weight - b.weight),
		edgeNum: edges.length
	} as Graph_边集数组表示
}

console.log(最小生成树_克鲁斯卡尔算法(邻接矩阵转边集数据(graph)))