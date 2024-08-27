import Cookies from "js-cookie";

export const saveToken = (
  newToken: string,
  privateValue: string,
  premiumValue: string
): void => {
  Cookies.set("authToken", newToken, { expires: 1 });
  Cookies.set("isPrivate", privateValue.toString());
  Cookies.set("isPremium", premiumValue.toString());
};

export const clearToken = (): void => {
  Cookies.remove("authToken");
  Cookies.remove("isPrivate");
  Cookies.remove("isPremium");
};

export const isPrivate = (): boolean => {
  const privateValue = Cookies.get("isPrivate");
  return privateValue === "true";
};

export const isPremium = (): boolean => {
  const premiumValue = Cookies.get("isPremium");
  return premiumValue === "true";
};

export const isAuth = (): boolean => {
  const token = Cookies.get("authToken");
  console.log("Auth Token:", token); // Debugging line
  return !!token;
};

export const getToken = (): string => {
  const token = Cookies.get("authToken");
  console.log("Retrieved Auth Token:", Cookies.get("authToken"));
  return token ?? "no token";
};
