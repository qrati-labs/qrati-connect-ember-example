import { module, test } from 'qunit';
import consentSource from '../../app/lib/cookieConsent.ts?raw';

module('Unit | cookie-consent gtag Consent Mode queue shape', function () {
  test('syncGtm queues consent commands as arguments, not a rest array', function (assert) {
    assert.true(
      /dataLayer!?\s*\.push\(arguments\)/.test(consentSource),
      'gtag must push the real arguments object so gtag.js recognizes consent commands',
    );

    assert.false(
      /dataLayer\?\.push\(args\)/.test(consentSource),
      'must not push a rest-parameter array (gtag.js drops Array queue entries)',
    );

    assert.false(
      /\(\.\.\.args:\s*unknown\[\]\)\s*=>\s*window\.dataLayer\?\.push\(args\)/.test(
        consentSource,
      ),
      'must not define gtag as an arrow that dataLayer.push(args)',
    );
  });
});
