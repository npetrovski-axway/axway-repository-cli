import HelmService from "../../services/helm";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Setup Axway Helm Repository",
    async action({ console }) {
        const service = new HelmService(console, config);
        return service.login();
    }
};
