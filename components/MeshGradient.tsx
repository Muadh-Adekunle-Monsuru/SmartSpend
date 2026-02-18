/** @paper-design/shaders-react@0.0.71 */
import { MeshGradient } from '@paper-design/shaders-react';

/**
 * from Paper
 * https://app.paper.design/file/01KHCG6B1FGAZWF9RVBTSZDE1N?node=01KHCHE66ED4PD9KJP7BWQGNE4
 * on Feb 13, 2026
 */
export default function MeshBG() {
	return (
		<MeshGradient
			speed={1}
			scale={1}
			distortion={0.8}
			swirl={0.1}
			colors={['#E0EAFF', '#241D9A', '#F75092', '#9F50D3']}
			style={{ height: '100vh', width: '100vw' }}
		/>
	);
}
