export const setToken = (token) => {
  localStorage.setItem("temitope", token); // make up your own token
};

export const fetchToken = () => {
  return localStorage.getItem("temitope");
};
