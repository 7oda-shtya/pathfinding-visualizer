import { cellKey, getNeighbors, getCellWeight, reconstructPath } from '../grid-utils'
import { MinHeap } from '../min-heap'

// مسافة "مانهاتن": مجموع الفرق الأفقي والرأسي بين خليتين. بنستخدمها
// كـ "Heuristic" — تخمين ذكي لأقل مسافة ممكنة للهدف من غير ما نحسب
// المسار الفعلي. بما إننا بنتحرك 4 اتجاهات بس (مش قطري)، دي أدق تخمين
// ممكن ومضمون إنه ماتبالغش (admissible) — يعني الخوارزمية تفضل صحيحة
function manhattanDistance([row1, col1], [row2, col2]) {
	return Math.abs(row1 - row2) + Math.abs(col1 - col2)
}

// A* زي Dijkstra بالظبط، بفرق واحد: بدل ما يرتب الهيب حسب "المسافة
// المقطوعة لحد دلوقتي" بس، بيرتبه حسب (المسافة المقطوعة + تخمين الباقي)
// — وده اللي بيخليه "يميل" ناحية الهدف بدل ما يفحص كل الاتجاهات بالتساوي
export function aStar({ rows, cols, walls, start, end, weights = {} }) {
	const wallsSet = new Set(walls.map(([r, c]) => cellKey(r, c)))
	const startKey = cellKey(...start)
	const endKey = cellKey(...end)

	const distances = new Map([[startKey, 0]])
	const cameFrom = new Map()
	const visited = new Set()
	const visitedOrder = []

	const heap = new MinHeap()
	heap.push(manhattanDistance(start, end), start)

	while (heap.size > 0) {
		const [row, col] = heap.pop()
		const key = cellKey(row, col)

		if (visited.has(key)) continue
		visited.add(key)
		visitedOrder.push([row, col])

		if (key === endKey) {
			return { visitedOrder, shortestPath: reconstructPath(cameFrom, endKey), found: true }
		}

		const currentDistance = distances.get(key)

		for (const [nRow, nCol] of getNeighbors(row, col, rows, cols)) {
			const nKey = cellKey(nRow, nCol)
			if (wallsSet.has(nKey) || visited.has(nKey)) continue

			const newDistance = currentDistance + getCellWeight(nRow, nCol, weights)

			if (newDistance < (distances.get(nKey) ?? Infinity)) {
				distances.set(nKey, newDistance)
				cameFrom.set(nKey, key)
				const priority = newDistance + manhattanDistance([nRow, nCol], end)
				heap.push(priority, [nRow, nCol])
			}
		}
	}

	return { visitedOrder, shortestPath: [], found: false }
}