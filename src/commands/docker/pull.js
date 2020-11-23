import { spawn } from 'child_process';
import { promisify } from 'util';
import { resolve } from '../../environments';

export default {
	desc: 'Pull an image from Axway Repository',
	args: [
		{
			name: 'image',
			hint: 'IMAGE',
			desc: 'Docker image name',
			required: true,
		},
	],
	async action({ argv, console }) {
		const config = resolve();

		const imageName = argv.image.startsWith(config.docker.url)
			? argv.image
			: `${config.docker.url}/${argv.image}`;

		console.log(`Pulling image ${imageName} ...`);

		try {
			const pull = spawn('docker', ['pull', imageName]);

			pull.stdout.pipe(process.stdout, { end: false });
			pull.stderr.pipe(process.stderr, { end: false });

			// pull.on('close', (code) => {

			// });
		} catch (e) {
			console.log(e);
		}
	},
};
