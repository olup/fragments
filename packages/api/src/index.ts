import { tokenHandler } from "./token";
import { getStore, setStore } from "./store";
import { match } from "path-to-regexp";

addEventListener("fetch", (event) => {
  const response = router(event.request).then((r) => {
    r.headers.set("Access-Control-Allow-Origin", "*");
    r.headers.set("content-type", "application/json;charset=UTF-8");
    r.headers.set("Access-Control-Allow-Headers", "*");
    r.headers.set("Access-Control-Allow-Methods", "*");
    return r;
  });

  event.respondWith(response);
});

const router = async (request: Request): Promise<Response> => {
  const routes = {
    "GET /token": tokenHandler,
    "GET /settings": getStore,
    "PUT /settings": setStore,
    "GET /foo": () => new Response("foo"),
  };

  for (const [route, handler] of Object.entries(routes)) {
    const [method, url] = route.split(" ");
    const normalUrl = "/" + request.url.split("/")[3].split("?")[0] || "";
    if (request.method === method && url === normalUrl) return handler(request);
  }

  return new Response("Not found");
};
