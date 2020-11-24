import * as request from '@axway/amplify-request';
import { resolve } from '../../environments';
import { createTable } from '@axway/amplify-cli-utils';

export default {
	desc: 'List all available Axway Repository images',
	aliases: ['ls'],
	options: {
		'--full-names': 'Show image full names',
		'--offset': 'Retrieving search results with offset pagination',
		'--limit': 'Max number of search results',
	},
	async action({ argv, console }) {
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
					/* searchParams: { q: argv.term }, */
				});

				const table = createTable([
					'NAME',
					'TAG',
					'TITLE',
					'DESCRIPTION',
					'SHA256',
				]);

				if (body) {
					body.forEach(async (result) => {
						table.push([
							(argv.fullNames ? `${config.docker.url}/` : '') +
								`${result.attributes.name}`,
							`${result.attributes.tag}`,
							`${result.meta.title}`,
							`${result.meta.description}`,
							`${result.checksums.sha256}`,
						]);
					});

					console.log(table.toString());
				}
			}
		} catch (err) {
			console.error(err.toString());
		}
	},
};
