import { cellKey } from './grid-utils'

// خوارزمية "Recursive Division": بتاخد مستطيل فاضي وتقسمه بحائط
// (أفقي أو رأسي) فيه فتحة عشوائية واحدة، وبعدين تكرر نفسها على
// المستطيلين الناتجين — وده اللي بيولّد المتاهات المتفرعة المعروفة
export function generateMaze(rows, cols, start, end) {
	const walls = new Set()

	function addWallSegment(row, col, isHorizontalWall, length, gapOffset) {
		for (let i = 0; i < length; i++) {
			if (i === gapOffset) continue
			const wallRow = isHorizontalWall ? row : row + i
			const wallCol = isHorizontalWall ? col + i : col
			walls.add(cellKey(wallRow, wallCol))
		}
	}

	function divide(row, col, height, width) {
		if (height < 3 || width < 3) return

		const horizontal = height > width

		if (horizontal) {
			const wallRow = row + 2 * Math.floor(Math.random() * Math.floor((height - 1) / 2)) + 1
			const gapOffset = Math.floor(Math.random() * width)
			addWallSegment(wallRow, col, true, width, gapOffset)

			divide(row, col, wallRow - row, width)
			divide(wallRow + 1, col, row + height - wallRow - 1, width)
		} else {
			const wallCol = col + 2 * Math.floor(Math.random() * Math.floor((width - 1) / 2)) + 1
			const gapOffset = Math.floor(Math.random() * height)
			addWallSegment(row, wallCol, false, height, gapOffset)

			divide(row, col, height, wallCol - col)
			divide(row, wallCol + 1, height, col + width - wallCol - 1)
		}
	}

	divide(0, 0, rows, cols)

	// نضمن إن نقطتي البداية والنهاية يفضلوا فاضيين، حتى لو الخوارزمية
	// حطّت حائط فوقهم بالصدفة
	walls.delete(cellKey(...start))
	walls.delete(cellKey(...end))

	return Array.from(walls).map((key) => key.split(',').map(Number))
}