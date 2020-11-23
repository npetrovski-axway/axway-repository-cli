import { initSDK } from '@axway/amplify-cli-utils';

export default (async () => {
	try {
		const { config, sdk } = initSDK();

		const account = await sdk.auth.find();
		if (!account) {
			throw new Error(
				'You are not logged in, or your session has expired. Use `axway auth login` first.'
			);
		}
		return account;
	} catch (err) {
		console.error(err.toString());
	}
})();
