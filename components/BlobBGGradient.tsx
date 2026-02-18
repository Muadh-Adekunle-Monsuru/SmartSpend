/** @paper-design/shaders-react@0.0.71 */
import { GrainGradient } from '@paper-design/shaders-react';

/**
 * from Paper
 * https://app.paper.design/file/01KHCG6B1FGAZWF9RVBTSZDE1N?node=01KHCHP9FZ35WQ9V07KE70KR7X
 * on Feb 13, 2026
 */
export default function () {
	return (
		<GrainGradient
			speed={0.2}
			scale={1}
			rotation={0}
			offsetX={0}
			offsetY={0}
			softness={0.5}
			intensity={0.5}
			noise={0.25}
			shape='corners'
			colors={['#7300FF', '#EBA8FF', '#00BFFF', '#2A00FF']}
			colorBack='#00000000'
			style={{
				backgroundColor: '#000000',
				height: '100vh',
				width: '100vw',
				position: 'absolute',
				zIndex: '0',
				top: '0',
				left: '0',
			}}
		/>
	);
}
