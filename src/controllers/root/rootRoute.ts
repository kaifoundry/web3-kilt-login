export function RootRouteResponse() {
  const appName = process.env.APP_NAME || 'N/A';
  const version = process.env.APP_VERSION || 'N/A';
  const port = process.env.PORT || 3000;
  const instance = process.env.NODE_APP_INSTANCE || 0;
  const mode = process.env.NODE_ENV || 'development';
  const maintainers = process.env.AUTHORS || 'N/A';

  return {
    appName: appName,
    version: version,
    port: port,
    instance: instance,
    mode: mode,
    maintainers: maintainers,
  };
}
