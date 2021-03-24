export const getStore = (token: string) => {
  return fetch(`${process.env.REACT_APP_API_URL}/settings`, {
    headers: {
      Authorization: `token ${token}`,
    },
  }).then((r) => r.json());
};

export const setStore = (token: string, body: any) => {
  return fetch(`${process.env.REACT_APP_API_URL}/settings`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(body),
  });
};
