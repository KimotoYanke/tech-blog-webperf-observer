import { ObservationResult } from "../entity/entity";

/**
 * URLに対し何らかのMetricsを観測して返すインターフェース
 */
export default interface ObserverRepository<T extends string = string> {
  /**
   * URLを観測し、Metricsを得て返す
   * @param url 
   * @returns キー→ObservationResultを返す
   */
  observe(url: string): Promise<{ [key in T]: ObservationResult | undefined }>;
}
