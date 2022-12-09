export type ObservationResult = { numericValue: number; score?: number; numericUnit?: string };

export type Metric = {
  key: string;
  timestamp: Date;
  result: ObservationResult;
};
