/*
import snooplogg from 'snooplogg';
import * as bin from 'hasbin';
if (!bin.sync('docker')) {
	throw new Error(
		`${snooplogg.styles.alert(
			'Docker is not installed on this machine. Visit https://docs.docker.com/get-docker/ for more information.'
		)}`
	);
}
*/

// import loadConfig, { Config } from '@axway/amplify-config';
// let config = loadConfig();
// config.set(
// 	'repository.docker.baseUrl',
// 	'https://docker-repository.axwaytest.net'
// );
// config.save();

import { resolve } from '../environments';

export default {
	desc: 'Docker commands',
	defaultCommand: 'help',
	commands: `${__dirname}/docker`,
	name: 'docker',
};
