#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve } from 'path';
import CLI from 'cli-kit';

const { version } = JSON.parse(
	readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8')
);

export default new CLI({
	title: 'Axway Repository CLI',
	commands: `${__dirname}/commands`,
	help: true,
	helpExitCode: 2,
	name: 'repository',
	version,
});
