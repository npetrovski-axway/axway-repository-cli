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
                return new Promise((resolve, reject) => {
                    const helmUrl = new URL(this.config.helm.repo);
                    const rm = spawn("helm", [ "repo", "remove", "axway" ]);
                    rm.on("close", () => {
                        const params = [
                            "repo",
                            "add",
                            "axway",
                            this.config.helm.repo,
                            "--username=cli",
                            `--password=${sessionId}`
                        ];
                        if (helmUrl.protocol === "http:") {
                            params.push("--insecure-skip-tls-verify");
                        }

                        const proc = spawn("helm", params);
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

    pull(chartname) {
        return this.login().then(() => {
            return new Promise((resolve, reject) => {
                const helmUrl = new URL(this.config.helm.repo);
                const imageName = chartname.startsWith(helmUrl.host)
                    ? chartname
                    : `${helmUrl.host}/${chartname}`;

                console.log(`Pulling package ${imageName}`);
                const proc = spawn("helm", [ "pull", imageName ]);

                proc.stdout.pipe(process.stdout, { end: false });
                proc.stderr.pipe(process.stderr, { end: false });
                proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
                proc.stderr.on("data", (err) => reject(err));
            });
        });
    }
}
