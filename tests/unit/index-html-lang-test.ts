import { module, test } from 'qunit';
import indexHtml from '../../index.html?raw';

module('Unit | production index.html document language', function () {
  test('declares lang=en on the root html element', function (assert) {
    assert.true(
      /<html\b[^>]*\blang="en"(?:\s|>)/i.test(indexHtml),
      'root html element has lang="en" for WCAG 3.1.1',
    );
    assert.false(
      /<html\s*>/i.test(indexHtml),
      'root html element is not a bare tag without lang',
    );
  });
});
