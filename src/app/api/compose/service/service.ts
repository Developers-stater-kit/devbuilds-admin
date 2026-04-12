import { compabilityCheck } from "../db-operations/compability-check";
import { getFeatureByKey, getFrameworkByKey } from "../db-operations/repository";
import { ComposeInput } from "../types/input-validation";
import { BuildStep, Command, ComposeResponse } from "../types/type";
import { ComposeContext, createContext } from "./context";
import { getRepoDetails } from "./fetch-repo";
import { generateDbOrmFiles } from "./db-orm-layer/generate-files";
import { generateAuthFiles } from "./auth-layer/generate-files";


type ComposeResult = {
  success: boolean;
  message: string;
  plan?: ComposeResponse;
}


export async function composeService(input: ComposeInput): Promise<ComposeResult> {
  try {
    const ctx = createContext();

    const framework = await resolveFramework(input.framework, ctx);
    const steps: BuildStep[] = [framework.workflow];
    const allEnvVars: string[] = [...framework.envVars];

    if (input.isShadcn) {
      const ui = await resolveUiLib(input);
      if (ui) steps.push(ui.workflow);
    }

    if (input.orm) {
      const dbLayer = await resolveDbOrm({
        frameworkKey: framework.key,
        input,
        ctx
      });
      steps.push(dbLayer.workflow);
      allEnvVars.push(...dbLayer.envVars);
    }

    if (input.authLib) {
      const authLayer = await resolveAuth({
        frameworkKey: framework.key,
        input,
        ctx
      });
      steps.push(authLayer.workflow);
      allEnvVars.push(...authLayer.envVars);
    }

    const dependencies = [
      ...new Set(steps.flatMap(d => d.dependencies || []))
    ];

    const devDependencies = [
      ...new Set(steps.flatMap(dd => dd.devDependencies || []))
    ];


    const plan: ComposeResult = {
      success: true,
      message: "Service composed successfully",
      plan: {
        layers: Layers(input),
        workflow: steps.sort((a, b) => a.order - b.order),
        metadata: {
          envVars: allEnvVars,
          dependencies: dependencies,
          devDependencies: devDependencies,
        }
      }
    }

    // console.log(JSON.stringify(plan, null, 2));
    return plan as ComposeResult;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

/**
 * HELPER: Build the metadata 'layers' object
 */
function Layers(input: ComposeInput) {
  const layers: any = {};


  layers.ui = {
    shadcn: input.isShadcn || false,
  }


  if (input.orm || input.dbEngine || input.dbProvider) {
    layers.database = {
      orm: input.orm,
      dbEngine: input.dbEngine,
      dbProvider: input.dbProvider
    };
  }

  if (input.authLib) {
    layers.authentication = {
      provider: input.authLib,
      methods: input.authMethods || [],
      socialProviders: input.socialProviders,
    };
  }
  return layers;
}

/**
 * HELPER: Resolve Framework details and config
 */
async function resolveFramework(key: string, ctx: ComposeContext) {
  const framework = await getFrameworkByKey(key);
  if (!framework.success) throw new Error(framework.mssg);

  const config = await getRepoDetails(
    framework.data.repoName,
    true
  );
  if (!config.success) throw new Error(`Framework config error: ${config.mssg}`);

  // storing the framework-config in the context
  ctx.frameworkConfig = config.data;

  return {
    key: framework.data.uniqueKey,
    envVars: config.data.envVars || [],
    workflow: {
      type: "framework" as const,
      key: framework.data.uniqueKey,
      repoName: framework.data.repoName,
      order: 1,
      envVars: config?.data?.metadata?.envVars,
      dependencies: config?.data?.metadata.dependencies || [],
      devDependencies: config?.data?.metadata.devDependencies || [],
    } as BuildStep
  };
}

/**
 * HELPER: Resolve UI LIB Shadcn details
 */
async function resolveUiLib(input: ComposeInput) {
  if (!input.isShadcn) return null;

  return {
    workflow: {
      type: "ui" as const,
      key: "shadcn",
      order: 2,
      commands: Command.shadcn
    }
  };
}

/**
 * HELPER: Resolve DB-ORM details
 */
async function resolveDbOrm({
  frameworkKey,
  input,
  ctx
}: {
  frameworkKey: string,
  input: ComposeInput,
  ctx: ComposeContext
}) {

  // 1️⃣ Compatibility check
  const isCompatible = await compabilityCheck(frameworkKey, input.orm!);
  if (!isCompatible.success) throw new Error(isCompatible.mssg);

  // 2️⃣ Get ORM feature info
  const details = await getFeatureByKey(input.orm!);
  if (!details.success) throw new Error(details.mssg);

  const repoName = details.data.repoName;

  // 3️⃣ Fetch ORM config (JSON)
  const configRes = await getRepoDetails(repoName, true);
  if (!configRes.success) throw new Error(`ORM config error: ${configRes.mssg}`);

  const ormConfig = configRes.data;
  const frameworkConfig = ctx.frameworkConfig;

  // 4️⃣ Generate actual files (content-based)
  const files = await generateDbOrmFiles(
    repoName,
    ormConfig,
    frameworkConfig,
    input
  );

  // 5️⃣ Collect dependencies
  const engine = ormConfig.engines[input.dbEngine!];
  const provider = ormConfig.providers[input.dbProvider!];

  const dependencies = [
    ...(ormConfig.dependencies || []),
    ...(engine?.dependencies || []),
    ...(provider?.dependencies || [])
  ];

  const devDependencies = [
    ...(ormConfig.devDependencies || []),
    ...(engine?.devDependencies || []),
    ...(provider?.devDependencies || [])
  ];

  // 6️⃣ Return layer
  return {
    envVars: ormConfig.envVars || [],
    workflow: {
      type: "db-orm" as const,
      key: details.data.uniqueKey,
      order: 3,
      files,
      dependencies,
      devDependencies,
      envVars: ormConfig.envVars || []
    }
  };
}

/**
 * HELPER: Resolve AUTH details
 */
async function resolveAuth({
  frameworkKey,
  input,
  ctx
}: {
  frameworkKey: string,
  input: ComposeInput,
  ctx: ComposeContext
}) {
  // 1️⃣ Compatibility check
  const isCompatible = await compabilityCheck(frameworkKey, input.authLib!);
  if (!isCompatible.success) throw new Error(isCompatible.mssg);

  // 2️⃣ Get AUTH feature info
  const details = await getFeatureByKey(input.authLib!);
  if (!details.success) throw new Error(details.mssg);

  const repoName = details.data.repoName;

  // 3️⃣ Fetch AUTH config (JSON)
  const configRes = await getRepoDetails(repoName, true);
  if (!configRes.success) throw new Error(`AUTH config error: ${configRes.mssg}`);

  const authConfig = configRes.data;
  const frameworkConfig = ctx.frameworkConfig;


  const files = await generateAuthFiles(
    authConfig,
    frameworkConfig,
    input
  );

  let envVars = [...(authConfig.envVars || [])];
  if (input.socialProviders?.length) {
    input.socialProviders.forEach((providerName) => {
      const provider = authConfig.features.Oauth.providers.find(
        (p: any) => p.name.toLowerCase() === providerName.toLowerCase()
      );

      if (provider?.metadata?.envVars) {
        envVars.push(...provider.metadata.envVars);
      }
    });
  }

  const dependencies = [
    ...(authConfig.dependencies || [])
  ];
  const devDependencies = [
    ...(authConfig.devDependencies || [])
  ];

  // UI deps (only if shadcn is enabled)
  if (input.isShadcn && authConfig.ui?.dependencies) {
    dependencies.push(...authConfig.ui.dependencies);
  }

  let commands;

  if (input.isShadcn && authConfig.ui?.["shadcn-components"]) {
    const components = authConfig.ui["shadcn-components"].join(" ");

    commands = {
      shadcn: {
        bun: Command.shadcn.bun.addComponent + components,
        npm: Command.shadcn.npm.addComponent + components,
        pnpm: Command.shadcn.pnpm.addComponent + components
      }
    };
  }


  // 6️⃣ Return layer
  return {
    envVars,
    workflow: {
      type: "authentication" as const,
      key: details.data.uniqueKey,
      order: 3,
      files,
      dependencies,
      devDependencies,
      commands,
      envVars
    }
  };
}
