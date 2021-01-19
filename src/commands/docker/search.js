import { resolve } from '../../environments';
import { createRequestClient, createTable } from '@axway/amplify-cli-utils';

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
	async action({ argv, console }) {
		const account = await require('../../_auth').default;
		const config = resolve();

		const service = createRequestClient({
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

		const table = createTable([
			'Name',
			'Tag',
			'Title',
			'Description',
			'SHA256',
		]);

		if (body) {
			for (const result of body) {
				table.push([
					(argv.fullNames ? `${config.docker.url}/` : '')
						+ `${result.attributes.name}`,
					`${result.attributes.tag}`,
					`${result.meta.title}`,
					`${result.meta.description}`,
					`${result.checksums.sha256}`,
				]);
			}

			console.log(table.toString());
		}
	}
};
