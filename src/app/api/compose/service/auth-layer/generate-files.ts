import { ComposeInput } from "../../types/input-validation";
import { FileType } from "../../types/type";
import { getRepoDetails } from "../fetch-repo";
import { resolvePaths } from "../path-resolver";

function extractBlock(content: string, key: string) {
    const regex = new RegExp(
        `${key}[\\s\\S]*?${key}`,
        "g"
    );
    const match = content.match(regex);
    return match ? match[0].replace(new RegExp(key, "g"), "").trim() : "";
}

export async function generateAuthFiles(
    authConfig: any,
    frameworkConfig: any,
    input: ComposeInput
): Promise<FileType[]> {

    const repoName = authConfig.repo.name;

    // 1️⃣ Pick base auth template
    let authTemplatePath: string;

    if (input.orm) {
        authTemplatePath = authConfig.orms[input.orm];
    } else {
        authTemplatePath = authConfig.engines[input.dbEngine!];
    }

    if (!authTemplatePath) {
        throw new Error(`Auth template not found for Authentication: ${input.orm}`);
    }

    const authFile = await getRepoDetails(repoName, false, authTemplatePath);
    if (!authFile.success) throw new Error("Failed to fetch auth template");

    let authContent = authFile.data as string;

    // 2️⃣ Inject DB provider
    if (input.orm) {
        const provider = authConfig.dbEngine[input.dbEngine!][input.orm];
        authContent = authContent.replace("__DB_PROVIDER__", provider);
    }

    // 3️⃣ Inject credentials
    if (input.authMethods?.includes("email")) {
        const cred = await getRepoDetails(
            repoName,
            false,
            authConfig.features.credentials.path
        );
        if (!cred.success) throw new Error("Failed to fetch credential data");
        authContent = authContent.replace(
            "// CREDENTIAL_START\n    // CREDENTIAL_END",
            `// CREDENTIAL_START\n${cred.data}\n    // CREDENTIAL_END`
        );
    }

    // 4️⃣ Inject OAuth providers
    if (input.socialProviders?.length) {
        const oauth = await getRepoDetails(
            repoName,
            false,
            authConfig.features.Oauth.path
        );
        if (!oauth.success) throw new Error("Failed to fetch OAuth template");

        const baseOauthTemplate = oauth.data as string;
        const oauthProvidersBlocks: string[] = [];

        input.socialProviders.forEach((provider) => {
            const providerLower = provider.toLowerCase();
            const providerUpper = provider.toUpperCase();

            const providerBlock = baseOauthTemplate
                .replace(/_SOCIAL_PROVIDER_NAME_/g, providerLower)
                .replace(/_SOCIAL_PROVIDER_UPPER_/g, providerUpper)

            oauthProvidersBlocks.push(providerBlock.trim());
        });

        const finalOauthBlock = `socialProviders: {\n${oauthProvidersBlocks.join(",\n")}\n}`;

        authContent = authContent.replace(
            /\/\/ OAUTH_START[\s\S]*?\/\/ OAUTH_END/,
            `// OAUTH_START\n${finalOauthBlock}\n// OAUTH_END`
        );
    };

    // 5️⃣ Fetch auth client
    const clientFile = await getRepoDetails(
        repoName,
        false,
        authConfig.structure.client.path
    );
    if (!clientFile.success) throw new Error("Failed to fetch client file");

    // 6️⃣ Fetch and extract route
    const routeFile = await getRepoDetails(
        repoName,
        false,
        authConfig.structure.api.path
    );
    if (!routeFile.success) throw new Error("Failed to fetch route file");
    const routeKey = authConfig.routes["nextjs-app-router"].routeKey;
    const routeContent = extractBlock(
        routeFile.data as string,
        routeKey
    );

    // 7️⃣ Fetch middleware
    const middlewareFile = await getRepoDetails(
        repoName,
        false,
        authConfig.structure.middleware.path
    );
    if (!middlewareFile.success) throw new Error("Failed to fetch middleware file");

    const paths = frameworkConfig.paths.authentication;

    // Resolve all framework paths with placeholders
    const serverPath = resolvePaths(paths.server, frameworkConfig);
    const clientPath = resolvePaths(paths.client, frameworkConfig);
    const apiPath = resolvePaths(paths.api, frameworkConfig);
    const middlewarePath = resolvePaths(paths.middleware, frameworkConfig);

    // 8️⃣ Build files array
    const files: FileType[] = [
        {
            path: serverPath,
            content: authContent.replace(/\/\/ FEATURES_START[\s\S]*?\/\/ FEATURES_END/, ""),
            name: authConfig.structure.server.name
        },
        {
            path: clientPath,
            content: clientFile.data as string,
            name: authConfig.structure.client.name
        },
        {
            path: apiPath,
            content: routeContent,
            name: authConfig.structure.api.name
        },
        {
            path: middlewarePath,
            content: middlewareFile.data as string,
            name: authConfig.structure.middleware.name
        }
    ];

    // 9️⃣ Fetch UI components (conditional)
    if (input.isShadcn) {
        const uiPath = resolvePaths(paths.ui, frameworkConfig);
        const uiComponentsPath = authConfig.ui.path;
        const componentFiles = authConfig.ui["component-files"];

        // Loop through each UI component file
        for (const componentFile of componentFiles) {
            const fullComponentPath = `${uiComponentsPath}${componentFile}`;

            const uiFile = await getRepoDetails(
                repoName,
                false,
                fullComponentPath
            );

            if (!uiFile.success) {
                console.warn(`Failed to fetch component ${componentFile}, skipping`);
                continue;
            }

            files.push({
                path: `${uiPath}`,
                content: uiFile.data as string,
                name: componentFile
            });
        }
    }
    return files;
}