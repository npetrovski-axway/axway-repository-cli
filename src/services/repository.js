import { createRequestClient } from "@axway/amplify-cli-utils";
import { retrieveSession } from "./auth";
import { resolve } from "../environments";

const config = resolve();

export default class RepositoryService {
    constructor(console) {
        this.console = console ?? global.console;
    }

    search(term) {
        return retrieveSession()
            .then(sessionId => {
                const service = createRequestClient({
                    prefixUrl: `https://${config.docker.url}`,
                    headers: {
                        "user-agent": "Axway CLI",
                        Authorization: `Bearer ${encodeURIComponent(sessionId)}`,
                    },
                    responseType: "json",
                });

                return service("v2/search", {
                    searchParams: { q: term },
                });
            });
    }
}
