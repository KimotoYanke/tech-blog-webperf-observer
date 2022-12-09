import { Metric } from '../entity/entity';
import ObserverRepository from '../repository/observer-repository';
import ReporterRepository from '../repository/reporter-repository';
import UrlGeneratorRepository from '../repository/url-generator-repository';

export const monitoringUsecase = async (
  urlGenerator: UrlGeneratorRepository,
  observer: ObserverRepository,
  reporter: ReporterRepository
) => {
  const metrics: Metric[] = [];

  for await (const url of urlGenerator) {
    const timestamp = new Date();
    const result = await observer.observe(url.url);
    for (const [key, value] of Object.entries(result)) {
      if (value) {
        metrics.push({
          key: 'webperf.lighthouse.' + url.tag + '.' + key,
          timestamp,
          result: value,
        });
      }
    }
  }

  return reporter.report(metrics);
};
