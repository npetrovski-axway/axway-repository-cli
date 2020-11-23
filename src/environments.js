import loadConfig from '@axway/amplify-config';

export const environments = {
	dev: {
		docker: {
			url: '127.0.0.1:5000',
		},
	},
	preprod: {
		docker: {
			url: 'docker-repository.axwaytest.net',
			// url: 'http://127.0.0.1:5000',
		},
	},
	prod: {
		docker: {
			url: 'docker-repository.axway.com',
		},
	},
};

export function resolve() {
	const env = loadConfig().get('env') || 'prod';
	return {
		name: env,
		...environments[env],
	};
}
