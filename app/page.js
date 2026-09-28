'use client'

import { useRef, useState } from 'react'
import Grid from '../components/Grid'
import Toolbar from '../components/Toolbar'
import LegendPanel from '../components/LegendPanel'
import ComparisonPanel from '../components/ComparisonPanel'
import { useIsMobile } from '../hooks/useIsMobile'

const DESKTOP_ROWS = 20
const DESKTOP_COLS = 40
const MOBILE_ROWS = 16
const MOBILE_COLS = 14
const ALL_ALGORITHMS = ['bfs', 'dfs', 'dijkstra', 'astar']

export default function Home() {
	const gridRef = useRef(null)
	const isMobile = useIsMobile()
	const rows = isMobile ? MOBILE_ROWS : DESKTOP_ROWS
	const cols = isMobile ? MOBILE_COLS : DESKTOP_COLS

	const [algorithm, setAlgorithm] = useState('bfs')
	const [brush, setBrush] = useState('wall')
	const [speed, setSpeed] = useState(20)
	const [isRunning, setIsRunning] = useState(false)
	const [stats, setStats] = useState(null)
	const [error, setError] = useState(null)
	const [compareMode, setCompareMode] = useState(false)
	const [comparisonResults, setComparisonResults] = useState(null)

	async function runAlgorithm(algo, snapshot) {
		const res = await fetch('/api/pathfind', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ algorithm: algo, grid: snapshot }),
		})
		const data = await res.json()
		if (!res.ok) throw new Error(data.error || 'Request failed')
		return data
	}

	async function handleVisualize() {
		if (!gridRef.current) return

		const snapshot = gridRef.current.getSnapshot()
		setIsRunning(true)
		setError(null)
		setStats(null)
		setComparisonResults(null)
		gridRef.current.clearVisualization()

		try {
			if (compareMode) {
				const results = {}
				for (const algo of ALL_ALGORITHMS) {
					results[algo] = await runAlgorithm(algo, snapshot)
				}
				setComparisonResults(results)

				// نعرض الأنيميشن البصرية بس للخوارزمية المختارة حاليًا، والبار تشارت
				// بيوري إحصائيات الكل — عشان نتجنب تعقيد رسم 4 جريدات في نفس الوقت
				const selected = results[algorithm]
				await gridRef.current.animate(selected.visitedOrder, selected.shortestPath, 105 - speed)
				setStats(selected.stats)
			} else {
				const data = await runAlgorithm(algorithm, snapshot)
				await gridRef.current.animate(data.visitedOrder, data.shortestPath, 105 - speed)
				setStats(data.stats)
				if (!data.found) setError('No path found between start and end.')
			}
		} catch (err) {
			setError(err.message || 'Failed to reach the server.')
		} finally {
			setIsRunning(false)
		}
	}

	function handleReset() {
		gridRef.current?.resetAll()
		setStats(null)
		setError(null)
		setComparisonResults(null)
	}

	function handleGenerateMaze() {
		gridRef.current?.generateMaze()
		setStats(null)
		setError(null)
		setComparisonResults(null)
	}

	return (
		<main className='flex flex-col gap-6 p-4 md:p-10 max-w-6xl mx-auto'>
			<div className='flex flex-col gap-1'>
				<h1 className='text-2xl md:text-3xl font-bold'>Pathfinding Visualizer</h1>
				<p className='text-gray-500 text-sm'>
					Draw walls or heavy terrain by clicking and dragging. Drag the green and red squares to move the start and end points.
				</p>
			</div>

			<Toolbar
				algorithm={algorithm} onAlgorithmChange={setAlgorithm}
				brush={brush} onBrushChange={setBrush}
				speed={speed} onSpeedChange={setSpeed}
				onVisualize={handleVisualize}
				onReset={handleReset}
				onGenerateMaze={handleGenerateMaze}
				compareMode={compareMode} onToggleCompare={setCompareMode}
				isRunning={isRunning}
				stats={stats}
			/>

			<LegendPanel />

			{error && (
				<div className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2'>{error}</div>
			)}

			{compareMode && <ComparisonPanel results={comparisonResults} />}

			<div className='overflow-x-auto pb-4' style={{ '--cell-size': isMobile ? '16px' : '24px' }}>
				<Grid ref={gridRef} rows={rows} cols={cols} disabled={isRunning} brush={brush} />
			</div>
		</main>
	)
}