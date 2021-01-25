import spawn from "cross-spawn";
import { retrieveSession } from "./auth";
import { loadConfig } from "@axway/amplify-cli-utils";
import { CFG_HELM_SET } from "../constants";
import RepositoryService from "./repository";

export default class HelmService {

    constructor(console, config) {
        this.console = console ?? global.console;
        this.config = config;
    }

    login() {
        return retrieveSession()
            .then(sessionId => {
                const helmUrl = new URL(this.config.helm.repo);
                return new Promise((resolve, reject) => {
                    const rm = spawn("helm", [ "repo", "remove", "axway" ]);
                    rm.on("close", () => {
                        const proc = spawn("helm", [
                            "repo",
                            "add",
                            "--username=cli",
                            `--password=${sessionId}`,
                            ((helmUrl.protocol === "http:") ? "--insecure-skip-tls-verify" : null),
                            "axway",
                            this.config.helm.url
                        ]);

                        proc.stdout.on("data", (data) => this.console.log(`Helm: ${data}`));
                        proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
                        proc.stderr.on("data", (err) => reject(err));

                        const cfg = loadConfig();
                        cfg.set(CFG_HELM_SET, true);
                        cfg.save();
                    });
                });
            });
    }

    logout() {
        return new Promise((resolve, reject) => {
            const proc = spawn("helm", [ "repo", "remove", "axway" ]);

            proc.stdout.on("data", (data) => this.console.log(`Helm: ${data}`));
            proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
            proc.stderr.on("data", (err) => reject(err));

            const cfg = loadConfig();
            cfg.delete(CFG_HELM_SET);
            cfg.save();

        });
    }

    search(term) {
        const repository = new RepositoryService(this.console, this.config);
        return repository.search(term, {
            groups: {
                helmType: {
                    "webliv.type": [ "HelmChart" ]
                }
            }
        });
    }
}
