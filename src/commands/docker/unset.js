import DockerService from "../../services/docker";

export default {
    desc: "Remove Axway Repository from docker native command",
    action({ console }) {
        const service = new DockerService(console);
        service.logout().catch(e => console.error(e.toString()));
    },
};
