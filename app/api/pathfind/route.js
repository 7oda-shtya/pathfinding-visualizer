import { NextResponse } from 'next/server'
import { algorithms } from '../../../lib/algorithms'

const MAX_ROWS = 60
const MAX_COLS = 100

function isValidCell(cell, rows, cols) {
	return (
		Array.isArray(cell) &&
		cell.length === 2 &&
		Number.isInteger(cell[0]) &&
		Number.isInteger(cell[1]) &&
		cell[0] >= 0 && cell[0] < rows &&
		cell[1] >= 0 && cell[1] < cols
	)
}

export async function POST(request) {
	let body

	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
	}

	const { algorithm, grid } = body ?? {}

	if (!algorithm || !algorithms[algorithm]) {
		return NextResponse.json(
			{ error: `Unknown algorithm "${algorithm}". Expected one of: ${Object.keys(algorithms).join(', ')}` },
			{ status: 400 }
		)
	}

	if (!grid || typeof grid.rows !== 'number' || typeof grid.cols !== 'number') {
		return NextResponse.json({ error: 'grid.rows and grid.cols are required numbers' }, { status: 400 })
	}

	const { rows, cols, walls = [], start, end, weights = {} } = grid

	if (rows <= 0 || cols <= 0 || rows > MAX_ROWS || cols > MAX_COLS) {
		return NextResponse.json({ error: `Grid size must be between 1x1 and ${MAX_ROWS}x${MAX_COLS}` }, { status: 400 })
	}

	if (!isValidCell(start, rows, cols) || !isValidCell(end, rows, cols)) {
		return NextResponse.json({ error: 'start and end must be [row, col] within grid bounds' }, { status: 400 })
	}

	const wallsSet = new Set(walls.map(([r, c]) => `${r},${c}`))
	if (wallsSet.has(`${start[0]},${start[1]}`) || wallsSet.has(`${end[0]},${end[1]}`)) {
		return NextResponse.json({ error: 'start and end cannot be walls' }, { status: 400 })
	}

	const startTime = performance.now()
	const result = algorithms[algorithm]({ rows, cols, walls, start, end, weights })
	const executionTimeMs = performance.now() - startTime

	return NextResponse.json({
		...result,
		stats: {
			visitedCount: result.visitedOrder.length,
			pathLength: result.shortestPath.length,
			executionTimeMs: Number(executionTimeMs.toFixed(3)),
		},
	})
}