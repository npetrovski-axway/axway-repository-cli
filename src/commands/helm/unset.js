import HelmService from "../../services/helm";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Remove Axway Repository from helm",
    async action({ console }) {
        const service = new HelmService(console, config);
        return service.logout();
    },
};
