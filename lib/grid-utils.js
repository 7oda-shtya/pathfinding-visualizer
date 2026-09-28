export function cellKey(row, col) {
	return `${row},${col}`
}

export function keyToCell(key) {
	const [row, col] = key.split(',').map(Number)
	return [row, col]
}

// الجيران الأربعة بس (فوق/تحت/شمال/يمين) — من غير قطري، عشان المقارنة
// بين الخوارزميات تبقى عادلة (نفس عدد الاتجاهات المتاحة للكل)
const DIRECTIONS = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
]

export function getNeighbors(row, col, rows, cols) {
	const neighbors = []
	for (const [dr, dc] of DIRECTIONS) {
		const newRow = row + dr
		const newCol = col + dc
		if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
			neighbors.push([newRow, newCol])
		}
	}
	return neighbors
}

export function getCellWeight(row, col, weights) {
	const key = cellKey(row, col)
	return weights?.[key] ?? 1
}

// بعد ما أي خوارزمية توصل للهدف، بنبني المسار بالرجوع من الهدف للبداية
// عن طريق خريطة "cameFrom" (كل خلية محتفظة بالخلية اللي جيت منها)
export function reconstructPath(cameFrom, endKey) {
	const path = []
	let currentKey = endKey

	while (currentKey !== undefined) {
		path.unshift(keyToCell(currentKey))
		currentKey = cameFrom.get(currentKey)
	}

	return path
}