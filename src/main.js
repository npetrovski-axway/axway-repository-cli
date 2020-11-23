import cli from './cli';

cli
	.exec()
	.than(({ console }) => {
		console.log('\n\nThank you for using Axway Repository CLI');
	})
	.catch((err) => {
		console.error(err);
		process.exit(err.exitCode || 1);
	});
