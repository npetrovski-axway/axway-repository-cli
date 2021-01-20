import HelmService from "../../services/helm";

export default {
    desc: "Remove Axway Repository from helm",
    action({ console }) {
        const service = new HelmService(console);
        service.logout().catch(e => console.error(e.toString()));
    },
};
