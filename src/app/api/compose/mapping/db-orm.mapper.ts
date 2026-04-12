import { ComposeInput } from "../types/input-validation";
import type { DbOrmFileMapEntry } from "../types/type";



export async function generateDbOrmFileMap(
    ormConfig: any,
    frameworkConfig: any,
    input: ComposeInput
): Promise<DbOrmFileMapEntry[]> {

    const engine = ormConfig.engines[input.dbEngine!];
    const provider = ormConfig.providers[input.dbProvider!];

    let clientSource = engine.client;
    if (provider?.client) {
        clientSource = provider.client;
    }
    const paths = frameworkConfig.paths["db-orm"];

    return [
        {
            source: clientSource,
            destination: paths.client.replace("<client>", ormConfig.structure.client),
            strategy: "copy",
            renameto: ormConfig.structure.client
        },
        {
            source: engine.config,
            destination: paths.config + "/" + ormConfig.structure.config,
            strategy: "copy",
            renameto: ormConfig.structure.config
        },
        {
            source: engine.schema,
            destination: paths.schema.replace("<schema>", ormConfig.structure.schema),
            strategy: "copy",
            renameto: ormConfig.structure.schema
        }
    ];
}
