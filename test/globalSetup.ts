const Config = {
  ENV: "test",
  HOST: "https://shop.beta.metasens.io",
  API_HOST: "https://shop-api.beta.metasens.io",
  SSO_HOST: "https://id.beta.metasens.io",
  METASENS_HOST: "https://www.beta.metasens.io",
};
vi.stubGlobal("Config", Config);
