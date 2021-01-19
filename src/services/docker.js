import spawn from "cross-spawn";
import { retrieveSession } from "./auth";
import { resolve } from "../environments";

const config = resolve();

export default class DockerService {

    constructor(console) {
        this.console = console ?? global.console;
    }

    login() {
        return retrieveSession()
            .then(sessionId => {
                return new Promise((resolve, reject) => {
                    const proc = spawn("docker", [
                        "login",
                        "--username=cli",
                        config.docker.url,
                        "--password-stdin",
                    ]);

                    setTimeout(() => {
                        proc.stdin.write(sessionId);
                        proc.stdin.end();
                    }, 100);

                    proc.stdout.on("data", (data) => this.console.log(`Docker: ${data}`));
                    proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
                    proc.stderr.on("data", (err) => reject(err));
                });
            });
    }

    logout() {
        return new Promise((resolve, reject) => {
            const proc = spawn("docker", [ "logout", config.docker.url ]);
            proc.stdout.on("data", (data) => this.console.log(`Docker: ${data}`));
            proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
            proc.stderr.on("data", (err) => reject(err));
        });
    }

    pull(image) {
        return this.login().then(() => {
            return new Promise((resolve, reject) => {
                const imageName = image.startsWith(config.docker.url)
                    ? image
                    : `${config.docker.url}/${image}`;

                console.log(`Pulling image ${imageName}`);
                const proc = spawn("docker", [ "pull", imageName ]);

                proc.stdout.pipe(process.stdout, { end: false });
                proc.stderr.pipe(process.stderr, { end: false });
                proc.on("close", (exitCode) => ((exitCode === 0) ? resolve(exitCode) : reject(exitCode)));
                proc.stderr.on("data", (err) => reject(err));
            });
        });
    }
}
