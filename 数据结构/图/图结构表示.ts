type GraphNode = number

export type Graph_邻接矩阵表示 = {
    points: GraphNode[],
    vers: number[][] // 长度为 pointNum
    pointNum: number
    verNum: number
}

export type Graph_边集数组表示 = {
    points: GraphNode[],
    edges: {
        begin: number
        end: number,
        weight: number
    }[]
    pointNum: number
    edgeNum: number
}