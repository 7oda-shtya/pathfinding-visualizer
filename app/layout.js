import './globals.css'

export const metadata = {
	title: 'Pathfinding Visualizer',
	description: 'Visualize BFS, DFS, Dijkstra and A* pathfinding algorithms in real time, powered by a Next.js API route.',
	icons: {
		icon: '/favicon.svg',
	},
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className='bg-gray-50 text-gray-900'>{children}</body>
		</html>
	)
}