import HelmService from "../../services/helm";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Unregister Axway Repository",
    aliases: [ "u" ],
    async action({ console }) {
        const service = new HelmService(console, config);
        return service.logout();
    },
};
