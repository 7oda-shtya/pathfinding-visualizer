const LEGEND_ITEMS = [
	{ type: 'empty', label: 'Empty cell', className: 'bg-white border border-gray-300' },
	{ type: 'wall', label: 'Wall', className: 'bg-gray-800' },
	{ type: 'weight', label: 'Heavy terrain (cost 5)', className: 'bg-amber-800/70' },
	{ type: 'start', label: 'Start', className: 'bg-emerald-500' },
	{ type: 'end', label: 'End', className: 'bg-rose-500' },
	{ type: 'visited', label: 'Visited', className: 'bg-sky-200' },
	{ type: 'path', label: 'Shortest path', className: 'bg-amber-400' },
]

const LegendPanel = () => {
	return (
		<div className='flex flex-wrap items-center gap-4 text-sm text-gray-600'>
			{LEGEND_ITEMS.map((item) => (
				<div key={item.type} className='flex items-center gap-2'>
					<span className={`w-4 h-4 rounded ${item.className}`} />
					<span>{item.label}</span>
				</div>
			))}
		</div>
	)
}

export default LegendPanel