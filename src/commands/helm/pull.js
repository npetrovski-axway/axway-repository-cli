import HelmService from "../../services/helm";
import { resolve } from "../../environments";

const config = resolve();

export default {
    desc: "Pull an Helm Chart from Axway Repository",
    args: [
        {
            name: "chartname",
            hint: "CHARTNAME",
            desc: "Helm chart name",
            required: true,
        },
    ],
    async action({ argv, console }) {
        const service = new HelmService(console, config);
        return service.pull(argv.chartname);
    }
};
