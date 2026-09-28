const CELL_TYPE_STYLES = {
	empty: 'bg-white border-gray-200',
	wall: 'bg-gray-800 border-gray-800',
	start: 'bg-emerald-500 border-emerald-600',
	end: 'bg-rose-500 border-rose-600',
	visited: 'bg-sky-200 border-sky-300',
	path: 'bg-amber-400 border-amber-500',
}

const Cell = ({ type, onMouseDown, onMouseEnter, onMouseUp }) => {
	return (
		<div
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
			onMouseUp={onMouseUp}
			className={`w-full h-full border transition-colors duration-150 ${CELL_TYPE_STYLES[type]}`}
		/>
	)
}

export default Cell