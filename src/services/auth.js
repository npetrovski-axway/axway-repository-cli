import { initSDK } from "@axway/amplify-cli-utils";

async function retrieveSession() {
    return initSDK().sdk.auth.find()
        .then(account => {
            if (!account) {
                return initSDK().sdk.auth.login();
            }
            return account;
        })
        .then(account => account?.sid);
}

export { retrieveSession };
