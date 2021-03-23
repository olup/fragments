export const getStore = (token: string) => {
  return fetch(`http://127.0.0.1:8787/settings`, {
    headers: {
      Authorization: `token ${token}`,
    },
  }).then((r) => r.json());
};

export const setStore = (token: string, body: any) => {
  return fetch(`http://127.0.0.1:8787/settings`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(body),
  });
};
