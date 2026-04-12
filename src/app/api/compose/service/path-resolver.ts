export function resolvePaths(
    pathTemplate: string,
    frameworkConfig: any
): string {
    return pathTemplate
        .replace(/<lib>/g, frameworkConfig.structure.lib)
        .replace(/<db>/g, frameworkConfig.structure.db)
        .replace(/<components>/g, frameworkConfig.structure.components)
        .replace(/<apiRoot>/g, frameworkConfig.structure.apiRoot)
        .replace(/<middleware>/g, frameworkConfig.structure.middleware)
        .replace(/<app>/g, frameworkConfig.structure.app)
        .replace(/<utils>/g, frameworkConfig.structure.utils)
        .replace(/<envExample>/g, frameworkConfig.structure.envExample);
}