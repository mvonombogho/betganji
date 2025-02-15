import { injectAxe, checkA11y } from 'axe-playwright';
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preRender(page) {
    await injectAxe(page);
  },
  async postRender(page) {
    await checkA11y(page, '#storybook-root', {
      includedImpacts: ['critical', 'serious'],
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    });
  }
};

export default config;