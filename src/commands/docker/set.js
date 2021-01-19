import DockerService from "../../services/docker";

export default {
    desc: "Setup docker native command for Axway Repository",
    action({ console }) {
        const service = new DockerService(console);
        service.login().catch(e => console.error(e.toString()));
    }
};
