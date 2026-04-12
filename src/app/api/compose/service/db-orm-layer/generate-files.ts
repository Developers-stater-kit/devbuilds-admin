import { ComposeInput } from "../../types/input-validation";
import { FileType } from "../../types/type";
import { getRepoDetails } from "../fetch-repo";
import { resolvePaths } from "../path-resolver"

export async function generateDbOrmFiles(
  repoName: string,
  ormConfig: any,
  frameworkConfig: any,
  input: ComposeInput
): Promise<FileType[]> {

  // 1️⃣ Resolve engine
  const engine = ormConfig.engines[input.dbEngine!];
  if (!engine) throw new Error("Invalid DB Engine selected");

  // 2️⃣ Resolve provider
  const provider = ormConfig.providers[input.dbProvider!];

  // 3️⃣ Decide correct client source
  let clientSource = engine.client;
  if (provider?.client) {
    clientSource = provider.client;
  }

  const paths = frameworkConfig.paths["db-orm"];

  // 4️⃣ Fetch file contents from GitHub
  const clientFile = await getRepoDetails(repoName, false, clientSource);
  const configFile = await getRepoDetails(repoName, false, engine.config);
  const schemaFile = await getRepoDetails(repoName, false, engine.schema);

  if (!clientFile.success || !configFile.success || !schemaFile.success) {
    throw new Error("Failed to fetch template files from GitHub");
  }

  // 5️⃣ Resolve final paths using utility function
  const clientPath = resolvePaths(paths.client, frameworkConfig);
  const configPath = resolvePaths(paths.config, frameworkConfig);
  const schemaPath = resolvePaths(paths.schema, frameworkConfig);

  // 6️⃣ Return ready-to-create files
  return [
    {
      path: clientPath,
      content: clientFile.data as string,
      name: ormConfig.structure.client
    },
    {
      path: configPath,
      content: configFile.data as string,
      name: ormConfig.structure.config
    },
    {
      path: schemaPath,
      content: schemaFile.data as string,
      name: ormConfig.structure.schema
    }
  ];
}