import { resolve } from "../../environments";
import { createTable } from "@axway/amplify-cli-utils";
import RepositoryService from "../../services/repository";

const config = resolve();

export default {
    desc: "Search the Axway Repository for images",
    args: [
        {
            name: "term",
            hint: "TERM",
            desc: "The image name",
            required: true,
        },
    ],
    options: {
        "--full-names": "Show image full names",
        "--offset": "Retrieving search results with offset pagination",
        "--limit": "Max number of search results",
    },
    action({ argv, console }) {
        const service = new RepositoryService(console);
        service.search(argv.term)
            .then(({ body }) => {
                if (body) {
                    const table = createTable([
                        "NAME",
                        "TAG",
                        "TITLE",
                        "DESCRIPTION",
                        "SHA256",
                    ]);

                    body.forEach(async (result) => {
                        table.push([
                            (argv.fullNames ? `${config.docker.url}/` : "")
								+ `${result.attributes.name}`,
                            `${result.attributes.tag}`,
                            `${result.meta.title}`,
                            `${result.meta.description}`,
                            `${result.checksums.sha256}`,
                        ]);
                    });

                    console.log(table.toString());
                }
                return true;
            })
            .catch(e => console.error(e.toString()));
    },
};
