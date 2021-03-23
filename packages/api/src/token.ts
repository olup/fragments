declare const GITHUB_CLIENT_ID: string;
declare const GITHUB_CLIENT_SECRET: string;

export async function tokenHandler(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const response = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=http://localhost:3000&scope=repo user`
    ).then((r) => r.text());

    return new Response(
      '{"' +
        decodeURI(response)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}',
      {
        status: 200,
      }
    );
  } catch (err) {
    throw err;
  }
}
