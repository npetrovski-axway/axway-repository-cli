import * as request from '@axway/amplify-request';
import { resolve } from '../../environments';
import { createTable } from '@axway/amplify-cli-utils';

export default {
	desc: 'Search the Axway Repository for images',
	args: [
		{
			name: 'term',
			hint: 'TERM',
			desc: 'The image name',
			required: true,
		},
	],
	options: {
		'--full-names': 'Show image full names',
		'--offset': 'Retrieving search results with offset pagination',
		'--limit': 'Max number of search results',
	},
	async action({ argv, console, terminal }) {
		try {
			const account = await require('../../_auth').default;
			const config = resolve();

			if (account) {
				const service = request.got.extend({
					prefixUrl: `https://${config.docker.url}`,
					headers: {
						'user-agent': 'Axway CLI',
						Authorization: `Bearer ${encodeURIComponent(account.sid)}`,
					},
					responseType: 'json',
				});

				const { body } = await service('v2/search', {
					searchParams: { q: argv.term },
				});

				const table = createTable(['NAME', 'DESCRIPTION']);

				if (body) {
					body.forEach(async (result) => {
						table.push([
							(argv.fullNames ? `${config.docker.url}/` : '') +
								`${result.attributes.name}:${result.attributes.tag}`,
							`${result.meta.description}`,
						]);
					});
				}

				console.log(table.toString());
			}
		} catch (err) {
			console.error(err.toString());
		}
	},
};
