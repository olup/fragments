const { GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID } = process.env;

import { APIGatewayEvent, Context } from "aws-lambda";
import fetch from "node-fetch";
export async function handler(event: APIGatewayEvent, context: Context) {
  const { code } = event.queryStringParameters as any;
  const response = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=http://localhost:3000&scope=repo user`
  ).then((r) => r.text());

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body:
      '{"' +
      decodeURI(response)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
  };
}
