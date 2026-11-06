import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';
import consentSource from '../../app/lib/cookieConsent.ts?raw';

module('Unit | footer cookie preferences reopen', function () {
  test('host footer wires CookieConsent showPreferences after first consent', function (assert) {
    assert.true(
      /export async function showCookiePreferences\(/.test(consentSource),
      'cookieConsent still exports showCookiePreferences',
    );
    assert.true(
      /CookieConsent\.showPreferences\(\)/.test(consentSource),
      'showCookiePreferences calls CookieConsent.showPreferences',
    );

    assert.true(
      /import \{[^}]*showCookiePreferences[^}]*\} from ['\"]\.\.\/lib\/cookieConsent['\"]/.test(
        demoSource,
      ),
      'qrati-demo imports showCookiePreferences',
    );

    assert.true(
      /class=\"footer-cookie-btn\"/.test(demoSource),
      'footer cookie control uses footer-cookie-btn',
    );
    assert.true(
      /data-cc=\"show-preferencesModal\"/.test(demoSource),
      'control uses vanilla-cookieconsent show-preferencesModal trigger',
    );
    assert.true(
      /\{\{on \"click\" this\.openCookiePreferences\}\}/.test(demoSource),
      'control click handler opens preferences through the host action',
    );
    assert.true(
      /Cookie Preferences/.test(demoSource),
      'visible Cookie Preferences label is present',
    );

    const footerNav = demoSource.match(
      /<nav aria-label=\"Footer navigation\">([\s\S]*?)<\/nav>/,
    );
    assert.ok(footerNav, 'footer navigation landmark exists');
    assert.true(
      /footer-cookie-btn/.test(footerNav?.[1] ?? ''),
      'cookie preferences control lives in footer navigation',
    );
  });
});
