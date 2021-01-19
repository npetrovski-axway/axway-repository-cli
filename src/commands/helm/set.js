import HelmService from "../../services/helm";

export default {
    desc: "Setup Axway Helm Repository",
    action({ console }) {
        const service = new HelmService(console);
        service.login().catch(e => console.error(e.toString()));
    }
};
