import { module, test } from 'qunit';
import consentSource from '../../app/lib/cookieConsent.ts?raw';

module('Unit | cookie-consent geo analytics default', function () {
  test('analytics enabled follows !required for opt-out vs opt-in', function (assert) {
    assert.true(
      /necessary:\s*\{\s*enabled:\s*true,\s*readOnly:\s*true\s*\}/.test(consentSource),
      'necessary stays enabled and read-only',
    );

    assert.true(
      /analytics:\s*\{\s*enabled:\s*!required\s*\}/.test(consentSource),
      'analytics is enabled only when geo consent is not required (opt-out)',
    );

    assert.false(
      /analytics:\s*\{\s*enabled:\s*true\s*\}/.test(consentSource),
      'analytics is not unconditionally enabled (would pre-check opt-in preferences)',
    );

    assert.false(
      /categories:\s*\{[^}]*analytics:\s*\{\s*\}/.test(consentSource),
      'analytics is not left as {} (library default enabled: false blocks opt-out GTM)',
    );
  });
});
