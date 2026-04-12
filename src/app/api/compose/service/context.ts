export type ComposeContext = {
    frameworkConfig?: any;
    ormConfig?: any;
    authConfig?:any;
  
    cache: Map<string, any>;
  };
  
  export const createContext = (): ComposeContext => ({
    cache: new Map()
  });
  