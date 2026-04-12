type Response = {
  success: boolean,
  mssg: string,
  data?: any,
}

export async function getRepoDetails(repoName: string, isconfig: boolean, filename?: string): Promise<Response> {
  try {
    const configUrl = isconfig
      ? `${process.env.GITHUB_RAW_URL}/${process.env.ORGANISATION_NAME}/${repoName}/${process.env.BRANCH_NAME}/${process.env.CONFIG_FILE_NAME}`
      : `${process.env.GITHUB_RAW_URL}/${process.env.ORGANISATION_NAME}/${repoName}/${process.env.BRANCH_NAME}/${filename}`;

    const res = await fetch(configUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch config for ${repoName}: ${res.status}`);
    }

    if (!isconfig) {
      const data = await res.text();
      return {
        success: true,
        mssg: "Got the Config File",
        data: data
      }
    }

    const config = await res.json();
    return {
      success: true,
      mssg: "Got the Config File",
      data : config
    };
  } catch (error: any) {
    return {
      success: false,
      mssg: error.message,
    };
  }
}