import DatadogGateway from './src/gateway/datadog-gateway';
import JsonGateway from './src/gateway/json-gateway';
import LighthouseGateway from './src/gateway/lighthouse-gateway';
import { monitoringUsecase } from './src/usecase/monitoring-usecase';

(async () => {
  if (!process.env.DD_APP_KEY) {
    throw new Error('envvar DD_APP_KEY is not defined');
  }
  if (!process.env.DD_API_KEY) {
    throw new Error('envvar DD_API_KEY is not defined');
  }

  let environment: 'production' | 'development' | 'staging' = 'development';
  if (
    process.env.ENVIRONMENT === 'production' ||
    process.env.ENVIRONMENT === 'development' ||
    process.env.ENVIRONMENT === 'staging'
  ) {
    environment = process.env.ENVIRONMENT;
  } else if (!!process.env.ENVIRONMENT) {
    throw new Error(
      `envvar ENVIRONMENT should be "production", "staging" or "development". ENVIRONMENT: "${process.env.ENVIRONMENT}"`
    );
  }

  const jsonGateway = new JsonGateway();
  const lighthouseGateway = new LighthouseGateway();
  const datadogGateway = new DatadogGateway(
    process.env.DD_API_KEY,
    process.env.DD_APP_KEY,
    environment
  );

  try {
    await monitoringUsecase(jsonGateway, lighthouseGateway, datadogGateway);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
})();
