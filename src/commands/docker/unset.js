import DockerService from "../../services/docker";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Remove Axway Repository from docker",
    async action({ console }) {
        const service = new DockerService(console, config);
        return service.logout();
    },
};
