import { loadConfig } from "@axway/amplify-cli-utils";
import * as bin from "hasbin";
import DockerService from "../services/docker";
import HelmService from "../services/helm";
import { CFG_DOCKER_SET, CFG_HELM_SET } from "../constants";

export async function tryRefreshRepositoryCredentials(console = global.console) {
    const cfg = loadConfig();
    if (cfg.get(CFG_DOCKER_SET) && bin.sync("docker")) {
        const service = new DockerService();
        await service.login()
            .then(() => console.log("Docker repository credentials updated."))
            .catch(e => console.error(e));

    }
    if (cfg.get(CFG_HELM_SET) && bin.sync("helm")) {
        const service = new HelmService();
        await service.login()
            .then(() => console.log("Helm repository credentials updated."))
            .catch(e => console.error(e));
    }
}

export async function tryRemoveRepositoryCredentials(console = global.console) {
    const cfg = loadConfig();
    if (cfg.get(CFG_DOCKER_SET)) {
        cfg.delete(CFG_DOCKER_SET);
        cfg.save();
        if (bin.sync("docker")) {
            const service = new DockerService();
            await service.logout()
                .then(() => console.log("Docker repository credentials removed."))
                .catch(e => console.error(e));
        }

    }
    if (cfg.get(CFG_HELM_SET)) {
        cfg.delete(CFG_HELM_SET);
        cfg.save();
        if (bin.sync("helm")) {
            const service = new DockerService();
            await service.logout()
                .then(() => console.log("Helm repository credentials removed."))
                .catch(e => console.error(e));
        }
    }
}
