import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';

function themeToggleMarkup(source: string) {
  const match = source.match(
    /<button\b[^>]*class="theme-toggle"[^>]*>[\s\S]*?<\/button>/,
  );
  if (!match) {
    throw new Error('missing theme-toggle button');
  }
  return match[0];
}

module('Unit | host theme toggle label in name', function () {
  test('theme toggle accessible name includes the visible Light/Dark label', function (assert) {
    const button = themeToggleMarkup(demoSource);
    const ariaLabel = button.match(/\baria-label="([^"]*)"/);
    const hasLight = button.includes('☀ Light');
    const hasDark = button.includes('🌙 Dark');

    assert.true(hasLight && hasDark, 'visible Light and Dark action labels remain');
    assert.false(
      /\baria-label="Toggle theme"/.test(button),
      'generic aria-label must not override the visible Light/Dark text',
    );

    if (ariaLabel) {
      const name = ariaLabel[1].toLowerCase();
      assert.true(
        name.includes('light') && name.includes('dark'),
        'any remaining aria-label must include the visible Light and Dark words',
      );
    } else {
      assert.ok(
        true,
        'no aria-label: accessible name comes from the visible Light/Dark text',
      );
    }
  });
});
