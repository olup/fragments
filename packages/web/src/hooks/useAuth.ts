import create from "zustand";

const useAuthStore = create<{
  isLoggedIn: boolean;
  user?: any;
  token?: string;
  isLoading?: boolean;
  set: any;
}>((set) => ({
  isLoggedIn: false,
  user: undefined,
  token: undefined,
  isLoading: true,

  set,
}));

export const useAuth = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const { isLoggedIn, isLoading, set, token, user } = useAuthStore((s) => s);

  const init = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = await getUser(token);
      set({
        isLoading: false,
        isLoggedIn: true,
        token,
        user,
      });
    } else if (urlParams.has("code")) {
      const code = urlParams.get("code");

      // remove code right away
      var uri = window.location.href;
      var clean_uri = uri.split("?")[0];
      window.history.replaceState({}, document.title, clean_uri);

      // get access_token
      const { access_token, refresh_token } = await fetch(
        `${process.env.REACT_APP_API_URL}/auth?code=${code}`
      ).then((r) => r.json());

      if (!access_token) return;

      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      const user = await getUser(access_token);

      set({
        isLoggedIn: true,
        isLoading: false,
        token: access_token,
        user,
      });
      return token;
    } else {
      set({
        isLoading: false,
        isLoggedIn: false,
      });
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    set({ isLoggedIn: false, settings: null, token: null });
  };

  const login = () => {
    const arr = window.location.href.split("/");
    const redirectUrl = arr[0] + "//" + arr[2];
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&response_type=code&redirect_uri=${redirectUrl}&scope=repo user`;
  };

  const getUser = (token: string) =>
    fetch(`https://api.github.com/user`, {
      headers: {
        authorization: `token ${token}`,
      },
    }).then((r) => r.json());

  return {
    isLoggedIn,
    isLoading,
    logout,
    login,
    init,
    token,
    user,
  };
};
