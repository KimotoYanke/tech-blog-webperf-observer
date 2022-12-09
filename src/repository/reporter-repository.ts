import { Metric } from '../entity/entity';

/**
 * 外部にMetricsをレポートするインターフェース
 */
export default interface ReporterRepository {
  /**
   * 観測結果をReporterに送信する
   * @param metrics Metric[]型で送信する
   * @returns 終了時にresolveされるPromise<void>
   */
  report(metrics: Metric[]): Promise<void>;
}
