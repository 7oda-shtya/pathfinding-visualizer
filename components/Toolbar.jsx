'use client'

const ALGORITHM_OPTIONS = [
	{ value: 'bfs', label: 'Breadth-First Search (BFS)' },
	{ value: 'dfs', label: 'Depth-First Search (DFS)' },
	{ value: 'dijkstra', label: "Dijkstra's Algorithm" },
	{ value: 'astar', label: 'A* Search' },
]

const Toolbar = ({
	algorithm, onAlgorithmChange,
	brush, onBrushChange,
	speed, onSpeedChange,
	onVisualize, onReset, onGenerateMaze,
	compareMode, onToggleCompare,
	isRunning, stats,
}) => {
	return (
		<div className='flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-xl p-4'>
			<div className='flex flex-col gap-1'>
				<label className='text-xs font-medium text-gray-500'>Algorithm</label>
				<select
					value={algorithm}
					onChange={(e) => onAlgorithmChange(e.target.value)}
					disabled={isRunning || compareMode}
					className='border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer disabled:opacity-50'
				>
					{ALGORITHM_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>{option.label}</option>
					))}
				</select>
			</div>

			<div className='flex flex-col gap-1'>
				<label className='text-xs font-medium text-gray-500'>Brush</label>
				<div className='flex border border-gray-300 rounded-md overflow-hidden'>
					<button
						onClick={() => onBrushChange('wall')}
						disabled={isRunning}
						className={`px-3 py-2 text-sm cursor-pointer disabled:opacity-50 ${brush === 'wall' ? 'bg-black text-white' : 'bg-white'}`}
					>
						Wall
					</button>
					<button
						onClick={() => onBrushChange('weight')}
						disabled={isRunning}
						className={`px-3 py-2 text-sm cursor-pointer disabled:opacity-50 ${brush === 'weight' ? 'bg-black text-white' : 'bg-white'}`}
					>
						Heavy terrain
					</button>
				</div>
			</div>

			<div className='flex flex-col gap-1'>
				<label className='text-xs font-medium text-gray-500'>Speed</label>
				<input
					type='range' min={5} max={100}
					value={speed}
					onChange={(e) => onSpeedChange(Number(e.target.value))}
					disabled={isRunning}
					className='cursor-pointer'
				/>
			</div>

			<button
				onClick={onVisualize}
				disabled={isRunning}
				className='bg-black text-white text-sm font-semibold rounded-full px-6 py-2 cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
			>
				{isRunning ? 'Running...' : compareMode ? 'Compare' : 'Visualize'}
			</button>

			<button
				onClick={onGenerateMaze}
				disabled={isRunning}
				className='border border-gray-300 text-sm font-semibold rounded-full px-6 py-2 cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50'
			>
				Generate Maze
			</button>

			<button
				onClick={onReset}
				disabled={isRunning}
				className='border border-gray-300 text-sm font-semibold rounded-full px-6 py-2 cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50'
			>
				Clear Board
			</button>

			<label className='flex items-center gap-2 text-sm cursor-pointer'>
				<input type='checkbox' checked={compareMode} onChange={(e) => onToggleCompare(e.target.checked)} disabled={isRunning} />
				Compare all algorithms
			</label>

			{stats && !compareMode && (
				<div className='flex items-center gap-4 text-xs text-gray-500 ml-auto'>
					<span>Visited: <strong className='text-black'>{stats.visitedCount}</strong></span>
					<span>Path length: <strong className='text-black'>{stats.pathLength}</strong></span>
					<span>Time: <strong className='text-black'>{stats.executionTimeMs}ms</strong></span>
				</div>
			)}
		</div>
	)
}

export default Toolbar