import HelmService from "../../services/helm";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Register and authenticate Axway Repository",
    aliases: [ "r" ],
    async action({ console }) {
        const service = new HelmService(console, config);
        return service.login();
    }
};
