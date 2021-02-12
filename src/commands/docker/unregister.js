import DockerService from "../../services/docker";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Unregister Axway Repository",
    aliases: [ "u" ],
    async action({ console }) {
        const service = new DockerService(console, config);
        return service.logout();
    },
};
