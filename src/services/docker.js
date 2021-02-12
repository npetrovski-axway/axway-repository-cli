import spawn from "cross-spawn";
import { retrieveSession } from "./auth";
import { CFG_DOCKER_SET } from "../constants";
import { loadConfig } from "@axway/amplify-cli-utils";
import RepositoryService from "./repository";

export default class DockerService {

    constructor(console, config) {
        this.console = console ?? global.console;
        this.config = config;
    }

    clientVersion() {
        return new Promise((resolve) => {
            const proc = spawn("docker", [ "version", "--format", "{{.Client.Version}}" ]);
            proc.stdout.on("data", (data) => resolve(`${data}`.split(".").map(d => parseInt(d))));
            proc.stderr.on("data", () => resolve([ 0, 0, 0 ]));
        });
    }

    login() {
        return Promise.all([ retrieveSession(), this.clientVersion() ])
            .then(([ sessionId, version ]) => {
                const dockerUrl = new URL(this.config.docker.repo);
                return new Promise((resolve, reject) => {
                    const proc = spawn("docker", [
                        "login",
                        "--username=cli",
                        dockerUrl.host,
                        (version[0] >= 20)
                            ? "--password-stdin"
                            : `--password=${sessionId}`,
                    ]);

                    if (version[0] >= 20) {
                        setTimeout(() => {
                            proc.stdin.write(sessionId);
                            proc.stdin.end();
                        }, 100);
                    }

                    proc.stdout.on("data", (data) => this.console.log(`Docker: ${data}`));
                    proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
                    proc.stderr.on("data", (err) => reject(err));

                    const cfg = loadConfig();
                    cfg.set(CFG_DOCKER_SET, true);
                    cfg.save();
                });
            });
    }

    logout() {
        return new Promise((resolve, reject) => {
            const dockerUrl = new URL(this.config.docker.repo);
            const proc = spawn("docker", [ "logout", dockerUrl.host ]);
            proc.stdout.on("data", (data) => this.console.log(`Docker: ${data}`));
            proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
            proc.stderr.on("data", (err) => reject(err));
            const cfg = loadConfig();
            cfg.delete(CFG_DOCKER_SET);
            cfg.save();
        });
    }

    pull(image) {
        return this.login().then(() => {
            return new Promise((resolve, reject) => {
                const dockerUrl = new URL(this.config.docker.repo);
                const imageName = image.startsWith(dockerUrl.host)
                    ? image
                    : `${dockerUrl.host}/${image}`;

                console.log(`Pulling image ${imageName}`);
                const proc = spawn("docker", [ "pull", imageName ]);

                proc.stdout.pipe(process.stdout, { end: false });
                proc.stderr.pipe(process.stderr, { end: false });
                proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
                proc.stderr.on("data", (err) => reject(err));
            });
        });
    }

    search(term) {
        const repository = new RepositoryService(this.console, this.config);
        return repository.search(term, {
            groups: {
                dockerType: {
                    "webliv.type": [ "DockerImage" ]
                }
            }
        });
    }
}
