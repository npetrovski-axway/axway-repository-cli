import DockerService from "../../services/docker";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Register and authenticate Axway Repository",
    aliases: [ "r" ],
    async action({ console }) {
        const service = new DockerService(console, config);
        return service.login();
    }
};
