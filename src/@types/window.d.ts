declare interface Config {
  ENV: Env;
  HOST: string;
  API_HOST: string;
  IMAGE_VERSION: string;
  NODE_ENV?: string;
}

declare interface Window {
  Config: Config;
}
