import cli from './cli';

cli
	.exec()
	.than(({ console }) => {
		console.log('\n\nThank you for using Axway Repository CLI');
	})
	.catch(err => {
		console.error(`${process.platform === 'win32' ? 'x' : '✖'} ${err}`);
		process.exit(err.exitCode || 1);
	});
