'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Cell from './Cell'
import { cellKey } from '../lib/grid-utils'
import { generateMaze } from '../lib/maze-generator'

const HEAVY_TERRAIN_WEIGHT = 5

const Grid = forwardRef(function Grid({ rows, cols, disabled, brush }, ref) {
	const [walls, setWalls] = useState(() => new Set())
	const [weights, setWeights] = useState(() => new Map())
	const [start, setStart] = useState([Math.floor(rows / 2), Math.floor(cols / 4)])
	const [end, setEnd] = useState([Math.floor(rows / 2), Math.floor((cols * 3) / 4)])
	const [visited, setVisited] = useState(() => new Set())
	const [path, setPath] = useState(() => new Set())

	const paintModeRef = useRef(null)
	const draggingPointRef = useRef(null)
	// لما حجم الجريد يتغيّر (زي التبديل بين نسخة الديسكتوب والموبايل)، لازم
	// نعيد حساب مكان البداية والنهاية عشان نضمن إنهم لسه جوه حدود الجريد
	// الجديد، ونشيل أي عائق أو خلية ثقيلة بقت برّه الحدود دي كمان
	useEffect(() => {
		setStart([Math.floor(rows / 2), Math.floor(cols / 4)])
		setEnd([Math.floor(rows / 2), Math.floor((cols * 3) / 4)])

		setWalls((prev) => {
			const next = new Set()
			prev.forEach((key) => {
				const [r, c] = key.split(',').map(Number)
				if (r < rows && c < cols) next.add(key)
			})
			return next
		})

		setWeights((prev) => {
			const next = new Map()
			prev.forEach((value, key) => {
				const [r, c] = key.split(',').map(Number)
				if (r < rows && c < cols) next.set(key, value)
			})
			return next
		})

		setVisited(new Set())
		setPath(new Set())
	}, [rows, cols])
	const activeIntervalsRef = useRef([])

	useEffect(() => {
		return () => {
			activeIntervalsRef.current.forEach(clearInterval)
		}
	}, [])

	function clearActiveIntervals() {
		activeIntervalsRef.current.forEach(clearInterval)
		activeIntervalsRef.current = []
	}

	useImperativeHandle(ref, () => ({
		getSnapshot() {
			const weightsObject = {}
			weights.forEach((value, key) => { weightsObject[key] = value })

			return {
				rows,
				cols,
				walls: Array.from(walls).map((key) => key.split(',').map(Number)),
				weights: weightsObject,
				start,
				end,
			}
		},
		clearVisualization() {
			clearActiveIntervals()
			setVisited(new Set())
			setPath(new Set())
		},
		resetAll() {
			clearActiveIntervals()
			setWalls(new Set())
			setWeights(new Map())
			setVisited(new Set())
			setPath(new Set())
		},
		generateMaze() {
			clearActiveIntervals()
			const mazeWalls = generateMaze(rows, cols, start, end)
			setWalls(new Set(mazeWalls.map(([r, c]) => cellKey(r, c))))
			setWeights(new Map())
			setVisited(new Set())
			setPath(new Set())
		},
		animate(visitedOrder, shortestPath, speedMs) {
			clearActiveIntervals()
			setVisited(new Set())
			setPath(new Set())

			return new Promise((resolve) => {
				let i = 0
				const visitInterval = setInterval(() => {
					if (i >= visitedOrder.length) {
						clearInterval(visitInterval)
						animatePath(shortestPath, speedMs, resolve)
						return
					}
					const [r, c] = visitedOrder[i]
					setVisited((prev) => new Set(prev).add(cellKey(r, c)))
					i++
				}, speedMs)
				activeIntervalsRef.current.push(visitInterval)
			})
		},
	}))

	function animatePath(shortestPath, speedMs, resolve) {
		let i = 0
		const pathInterval = setInterval(() => {
			if (i >= shortestPath.length) {
				clearInterval(pathInterval)
				resolve()
				return
			}
			const [r, c] = shortestPath[i]
			setPath((prev) => new Set(prev).add(cellKey(r, c)))
			i++
		}, Math.max(speedMs, 15))
		activeIntervalsRef.current.push(pathInterval)
	}

	function getCellType(row, col) {
		if (row === start[0] && col === start[1]) return 'start'
		if (row === end[0] && col === end[1]) return 'end'
		const key = cellKey(row, col)
		if (path.has(key)) return 'path'
		if (visited.has(key)) return 'visited'
		if (walls.has(key)) return 'wall'
		if (weights.has(key)) return 'weight'
		return 'empty'
	}

	function paintCell(row, col, action) {
		if (row === start[0] && col === start[1]) return
		if (row === end[0] && col === end[1]) return

		const key = cellKey(row, col)

		if (brush === 'wall') {
			setWalls((prev) => {
				const next = new Set(prev)
				action === 'add' ? next.add(key) : next.delete(key)
				return next
			})
		} else {
			setWeights((prev) => {
				const next = new Map(prev)
				action === 'add' ? next.set(key, HEAVY_TERRAIN_WEIGHT) : next.delete(key)
				return next
			})
		}
	}

	function handleMouseDown(row, col) {
		if (disabled) return

		if (row === start[0] && col === start[1]) {
			draggingPointRef.current = 'start'
			return
		}
		if (row === end[0] && col === end[1]) {
			draggingPointRef.current = 'end'
			return
		}

		const key = cellKey(row, col)
		const isCurrentlyPainted = brush === 'wall' ? walls.has(key) : weights.has(key)
		paintModeRef.current = isCurrentlyPainted ? 'remove' : 'add'
		paintCell(row, col, paintModeRef.current)
	}

	function handleMouseEnter(row, col) {
		if (disabled) return

		const key = cellKey(row, col)

		if (draggingPointRef.current === 'start') {
			if (!walls.has(key) && !weights.has(key) && !(row === end[0] && col === end[1])) setStart([row, col])
			return
		}
		if (draggingPointRef.current === 'end') {
			if (!walls.has(key) && !weights.has(key) && !(row === start[0] && col === start[1])) setEnd([row, col])
			return
		}
		if (paintModeRef.current) {
			paintCell(row, col, paintModeRef.current)
		}
	}

	function handleMouseUp() {
		paintModeRef.current = null
		draggingPointRef.current = null
	}

	return (
		<div
			onMouseLeave={handleMouseUp}
			onMouseUp={handleMouseUp}
			className='grid select-none border border-gray-300 w-fit mx-auto'
			style={{
				gridTemplateColumns: `repeat(${cols}, var(--cell-size, 24px))`,
				gridTemplateRows: `repeat(${rows}, var(--cell-size, 24px))`,
			}}
		>
			{Array.from({ length: rows }).map((_, row) =>
				Array.from({ length: cols }).map((_, col) => (
					<Cell
						key={cellKey(row, col)}
						type={getCellType(row, col)}
						onMouseDown={() => handleMouseDown(row, col)}
						onMouseEnter={() => handleMouseEnter(row, col)}
						onMouseUp={handleMouseUp}
					/>
				))
			)}
		</div>
	)
})

export default Grid