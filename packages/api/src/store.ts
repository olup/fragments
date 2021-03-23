declare const STORE: KVNamespace;

export async function getStore(request: Request): Promise<Response> {
  const auth = request.headers.get("Authorization");
  if (!auth) throw new Error("Not authorized");

  const user = await fetch("https://api.github.com/user", {
    headers: {
      authorization: auth,
      "user-agent": "fragment",
    },
  }).then((r) => r.json());

  const userId = user.id;
  const setting = await STORE.get(userId + ":store");

  return new Response(setting || "{}", {
    status: 200,
  });
}

export async function setStore(request: Request): Promise<Response> {
  const auth = request.headers.get("Authorization");
  if (!auth) throw new Error("Not authorized");

  const user = await fetch("https://api.github.com/user", {
    headers: {
      authorization: auth,
      "user-agent": "fragment",
    },
  }).then((r) => r.json());

  const userId = user.id;
  const body = await request.json();
  await STORE.put(userId + ":store", JSON.stringify(body)).catch((err) =>
    console.log(err)
  );

  return new Response(JSON.stringify(body), {
    status: 200,
  });
}
