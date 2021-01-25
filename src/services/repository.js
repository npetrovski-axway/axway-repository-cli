import { createRequestClient } from "@axway/amplify-cli-utils";
import { retrieveSession } from "./auth";

export default class RepositoryService {
    constructor(console, config) {
        this.console = console ?? global.console;
        this.config = config;
    }

    search(term, params = {}) {
        return retrieveSession()
            .then(sessionId => {
                const service = createRequestClient({
                    prefixUrl: this.config.url,
                    headers: {
                        "User-Agent": "Axway CLI",
                        Cookie: `connect.sid=${encodeURIComponent(sessionId)}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    responseType: "json",
                });

                return service("api/v1/artifacts/search", {
                    json: {
                        query: term,
                        ...params
                    }
                });
            });
    }
}
