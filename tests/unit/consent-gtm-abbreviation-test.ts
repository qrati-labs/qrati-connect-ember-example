import { module, test } from 'qunit';
import consentSource from '../../app/lib/cookieConsent.ts?raw';

module('Unit | cookie-consent GTM abbreviation expansion', function () {
  test('analytics preferences copy expands Google Tag Manager (WCAG 3.1.4)', function (assert) {
    const analyticsSection = consentSource.match(
      /title:\s*'Analytics cookies',\s*description:\s*'([^']*)'/,
    );

    assert.ok(analyticsSection, 'preferences still include an Analytics cookies section');

    const description = analyticsSection?.[1] ?? '';

    assert.true(
      /Google Tag Manager/.test(description),
      'analytics description includes the expanded form Google Tag Manager',
    );
    assert.true(
      /Google Tag Manager\s*\(GTM\)\s*ID/.test(description),
      'first (only) GTM use is immediately after the expanded form (G97)',
    );
    assert.false(
      /(?<!Google Tag Manager \()GTM ID/.test(description),
      'analytics description must not use a bare GTM ID without expansion',
    );
  });
});
