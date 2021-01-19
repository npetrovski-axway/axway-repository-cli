import spawn from 'cross-spawn';
import { resolve } from '../../environments';

export default {
	desc: 'Setup docker native command for Axway Repository',

	async action({ console }) {
		const account = await require('../../_auth').default;
		const config = resolve();

		const dockerLogin = spawn('docker', [
			'login',
			'--username=system',
			config.docker.url,
			'--password-stdin',
		]);

		setTimeout(() => {
			dockerLogin.stdin.write(account.sid);
			dockerLogin.stdin.end();
		}, 100);

		dockerLogin.stdout.on('data', (data) => {
			console.log(`${data}`);
		});

		dockerLogin.stderr.on('data', (data) => {
			console.error(`${data}`);
		});

		// dockerLogin.on('close', (code) => {
		// 	console.log(`child process exited with code ${code}`);
		// });
	}
};
