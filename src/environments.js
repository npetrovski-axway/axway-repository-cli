import loadConfig from '@axway/amplify-config';

export const environments = {
	dev: {
		docker: {
			url: '127.0.0.1:5000'
		}
	},
	preprod: {
		docker: {
			url: 'docker-repository.axwaytest.net',
			// url: 'http://127.0.0.1:5000',
		}
	},
	prod: {
		docker: {
			url: 'docker-repository.axway.com'
		}
	}
};

const mapping = {
	development: 'dev',
	preproduction: 'preprod',
	'pre-production': 'preprod',
	production: 'prod',
	staging: 'preprod',
	test: 'preprod'
};

export function resolve() {
	let env = loadConfig().get('env') || 'prod';
	env = env.toLowerCase();
	env = mapping[env] || env;
	return {
		name: env,
		...environments[env]
	};
}
