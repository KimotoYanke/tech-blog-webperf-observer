import { client, v2 } from '@datadog/datadog-api-client';
import { Metric } from '../entity/entity';
import ReporterRepository from '../repository/reporter-repository';

const getTimestamp = (date: Date) => Math.round(date.getTime() / 1000);

export default class DatadogGateway implements ReporterRepository {
  apiInstance: v2.MetricsApi;
  environment: 'development' | 'staging' | 'production';
  constructor(
    apiKeyAuth: string,
    appKeyAuth: string,
    environment: 'development' | 'staging' | 'production'
  ) {
    const config = client.createConfiguration({ authMethods: { appKeyAuth, apiKeyAuth } });
    this.apiInstance = new v2.MetricsApi(config);
    this.environment = environment;
  }
  async report(
    metrics: Metric[]
  ) {
    const params: v2.MetricsApiSubmitMetricsRequest = {
      body: {
        series: metrics.map(
          (m): v2.MetricSeries => ({
            metric: m.key,
            points: [{ timestamp: getTimestamp(m.timestamp), value: m.result.numericValue }],
            type: 3,
            unit: m.result.numericUnit,
            tags: ['env:' + this.environment],
          })
        ),
      },
    };

    await this.apiInstance.submitMetrics(params).catch(e => {
      throw e;
    });
  }
}
