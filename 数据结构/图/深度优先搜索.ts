import { Graph_邻接矩阵表示 } from './图结构表示'

const visited: boolean[] = []

/**
 * 图的深度优先搜索, 相当于树的先序遍历
 * @param graph 
 * @param i 
 */
export function DFS(graph: Graph_邻接矩阵表示, i: number) {
	visited[i] = true
	console.log(graph.points[i]) // 打印顶点， 也可以是其他操作
	for (let j = 0; j < graph.vers[i].length; i++) {
		if (graph.vers[i][j] && !visited[j]) {
			DFS(graph, j)
		}
	}
}