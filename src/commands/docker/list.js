import { EOL } from "os";
import { createTable } from "@axway/amplify-cli-utils";
import DockerService from "../../services/docker";
import { resolve } from "../../environments";
import { strTruncate } from "../../utils";

const config = resolve();

export default {
    desc: "List all available Axway Repository images",
    aliases: [ "ls" ],
    options: {
        "--full-names": "Show full image names",
        "--offset": "Retrieving search results with offset pagination",
        "--limit": "Max number of search results",
    },
    async action({ argv, console }) {
        const service = new DockerService(console, config);
        return service.search()
            .then(({ body }) => {
                if (body && body.entries?.length > 0) {
                    console.log(`Available entries: ${body.entries.length}${EOL}`);
                    const dockerUrl = new URL(config.docker.repo);
                    const table = createTable([
                        "IMAGE",
                        "PRODUCT",
                        "TITLE",
                        "DESCRIPTION",
                        // "DIGEST",
                    ]);
                    body.entries.forEach(async (result) => {
                        table.push([
                            (argv.fullNames ? `${dockerUrl.host}/` : "")
								+ `${result.artifactory.repo}/${result.artifactory.package.name}:${result.artifactory.package.version}`,
                            `${result.webliv.sfdc.mainProduct.name}`,
                            `${result.webliv.title}`,
                            `${strTruncate(result.webliv.description, 35)}`,
                            // `${result.artifactory.digests.sha256}`,
                        ]);
                    });

                    console.log(table.toString());
                } else {
                    console.log("No entries found.");
                }
                return true;
            });
    },
};
