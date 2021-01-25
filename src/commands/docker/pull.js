import DockerService from "../../services/docker";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Pull an image from Axway Repository",
    args: [
        {
            name: "image",
            hint: "IMAGE",
            desc: "Docker image name",
            required: true,
        },
    ],
    async action({ argv, console }) {
        const service = new DockerService(console, config);
        return service.pull(argv.image);
    }
};
