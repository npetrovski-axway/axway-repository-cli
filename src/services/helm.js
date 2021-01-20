import spawn from "cross-spawn";
import { retrieveSession } from "./auth";
import { resolve } from "../environments";
import { loadConfig } from "@axway/amplify-cli-utils";
import { CFG_HELM_SET } from "../constants";

const config = resolve();

export default class HelmService {

    constructor(console) {
        this.console = console ?? global.console;
    }

    login() {
        return retrieveSession()
            .then(sessionId => {
                return new Promise((resolve, reject) => {
                    const proc = spawn("helm", [
                        "repo",
                        "add",
                        "axway",
                        config.docker.url,
                        "--username=cli",
                        `--password=${sessionId}`,
                    ]);

                    proc.stdout.on("data", (data) => this.console.log(`Helm: ${data}`));
                    proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
                    proc.stderr.on("data", (err) => reject(err));

                    const cfg = loadConfig();
                    cfg.set(CFG_HELM_SET, true);
                    cfg.save();
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

}
