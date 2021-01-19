import { initSDK } from '@axway/amplify-cli-utils';

export default (async () => {
	const { sdk } = initSDK();

	const account = await sdk.auth.find();
	if (account) {
		return account;
	}

	throw new Error(
		'You are not logged in, or your session has expired. Use `axway auth login` first.'
	);
})();
