const ALGORITHM_LABELS = {
	bfs: 'BFS',
	dfs: 'DFS',
	dijkstra: 'Dijkstra',
	astar: 'A*',
}

const ComparisonPanel = ({ results }) => {
	if (!results) return null

	const maxVisited = Math.max(...Object.values(results).map((r) => r.stats.visitedCount), 1)

	return (
		<div className='flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-4'>
			<span className='font-semibold text-sm'>Algorithm comparison</span>

			<div className='flex flex-col gap-3'>
				{Object.entries(results).map(([key, result]) => (
					<div key={key} className='flex flex-col gap-1'>
						<div className='flex items-center justify-between text-xs text-gray-500'>
							<span className='font-medium text-black'>{ALGORITHM_LABELS[key]}</span>
							<span>
								{result.found ? `${result.stats.pathLength} steps` : 'No path'} · {result.stats.visitedCount} visited · {result.stats.executionTimeMs}ms
							</span>
						</div>
						<div className='h-2 bg-gray-100 rounded overflow-hidden'>
							<div
								className='h-full bg-sky-400'
								style={{ width: `${(result.stats.visitedCount / maxVisited) * 100}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default ComparisonPanel