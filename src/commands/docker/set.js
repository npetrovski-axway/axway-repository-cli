import DockerService from "../../services/docker";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Setup docker native command for Axway Repository",
    async action({ console }) {
        const service = new DockerService(console, config);
        return service.login();
    }
};
