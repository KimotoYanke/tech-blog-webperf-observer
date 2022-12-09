import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import ObserverRepository from '../repository/observer-repository';
import Audit from 'lighthouse/types/audit';
import { ObservationResult } from '../entity/entity';
import { CliFlags } from 'lighthouse/types/externs';
import { addParentForObject } from '../utils/add-parent-for-object';

type AuditType =
  | 'first_content_paint'
  | 'largest_contentful_paint'
  | 'max_potential_fid'
  | 'total_blocking_time'
  | 'cumulative_layout_shift';

type Device = 'mobile' | 'desktop';

type ResultKey = `${Device}.${AuditType}`;

const convertLHResultToObservationResult = (r: Audit.Result): ObservationResult | undefined => {
  return r.numericValue !== undefined
    ? {
        score: r.score || undefined,
        numericValue: r.numericValue,
        numericUnit: r.numericUnit || undefined,
      }
    : undefined;
};

export default class LighthouseGateway implements ObserverRepository<ResultKey> {
  async observeForDevice(url: string, device: Device) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });

    let flags: Partial<CliFlags> = {};
    if (device === 'mobile') {
      flags = {
        ...flags,
        ...require('lighthouse/lighthouse-core/config/lr-mobile-config.js').settings, // lighthouseのmobileの方の設定を直接読み込んでくる
      };
    } else {
      flags = {
        ...flags,
        ...require('lighthouse/lighthouse-core/config/lr-desktop-config.js').settings, // lighthouseのdesktopの方の設定を直接読み込んでくる
      };
    }

    console.log('start: ' + url + ' in ' + device);
    console.time(url + ' in ' + device);
    const runnerResult = await lighthouse(url, {
      logLevel: 'error' as const,
      output: ['json' as const],
      onlyCategories: ['performance'],
      port: chrome.port,
      quiet: true,
      ...flags,
    });
    console.log('end: ' + url);
    console.timeEnd(url + ' in ' + device);

    const firstContentPaint = runnerResult.lhr.audits['first-contentful-paint'];
    const largestContentfulPaint = runnerResult.lhr.audits['largest-contentful-paint'];
    const maxPotentialFid = runnerResult.lhr.audits['max-potential-fid'];
    const totalBlockingTime = runnerResult.lhr.audits['total-blocking-time'];
    const cumulativeLayoutShift = runnerResult.lhr.audits['cumulative-layout-shift'];
    return {
      first_content_paint: convertLHResultToObservationResult(firstContentPaint),
      largest_contentful_paint: convertLHResultToObservationResult(largestContentfulPaint),
      max_potential_fid: convertLHResultToObservationResult(maxPotentialFid),
      total_blocking_time: convertLHResultToObservationResult(totalBlockingTime),
      cumulative_layout_shift: convertLHResultToObservationResult(cumulativeLayoutShift),
    } as const;
  }

  async observe(url: string) {
    const desktop = await this.observeForDevice(url, 'desktop');
    const mobile = await this.observeForDevice(url, 'mobile');

    const mobileResult = addParentForObject<
      'mobile',
      AuditType,
      { [key in AuditType]: ObservationResult | undefined }
    >('mobile', mobile);

    const desktopResult = addParentForObject<
      'desktop',
      AuditType,
      { [key in AuditType]: ObservationResult | undefined }
    >('desktop', desktop);

    const result = {
      ...mobileResult,
      ...desktopResult,
    };
    console.table(result);

    return result;
  }
}
