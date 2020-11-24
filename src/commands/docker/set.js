import { resolve } from '../../environments';
import { spawn } from 'child_process';

export default {
	desc: 'Setup docker native command for Axway Repository',

	async action({ console }) {
		try {
			const account = await require('../../_auth').default;

			if (account) {
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
		} catch (err) {
			console.error(err.toString());
		}
	},
};
