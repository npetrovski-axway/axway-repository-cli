import DockerService from "../../services/docker";

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
    action({ argv, console }) {
        const service = new DockerService(console);
        service.pull(argv.image).catch(e => console.error(e.toString()));
    }
};
