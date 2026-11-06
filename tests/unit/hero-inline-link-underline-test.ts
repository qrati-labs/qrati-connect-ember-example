import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import demoSource from '../../app/components/qrati-demo.gts?raw';

function lastDecoration(css: string, selectorPattern: RegExp) {
  const matches = [
    ...css.matchAll(
      /([^{}]+)\{([^}]*(?:text-decoration|text-decoration-line)\s*:[^;}]+;[^}]*)\}/g,
    ),
  ];
  let value: string | undefined;
  for (const match of matches) {
    const selectors = match[1].split(',').map((part) => part.trim());
    if (selectors.some((selector) => selectorPattern.test(selector))) {
      const decl = match[2].match(
        /(?:text-decoration|text-decoration-line)\s*:\s*([^;]+);/i,
      );
      if (decl) {
        value = decl[1].trim();
      }
    }
  }
  return value;
}

module('Unit | host hero inline link underline', function () {
  test('in-paragraph hero Qrati links keep a resting underline', function (assert) {
    assert.true(
      /<h1>[\s\S]*href="https:\/\/qrati\.com"[\s\S]*<\/h1>/.test(demoSource),
      'hero h1 still contains a qrati.com link',
    );
    assert.true(
      /class="hero-copy"[\s\S]*href="https:\/\/qrati\.com"/.test(demoSource),
      'hero-copy still contains a qrati.com link',
    );

    const copyDecoration = lastDecoration(
      appCss,
      /^\.hero-copy(?:\s+a|a)$/,
    );
    const headingDecoration = lastDecoration(appCss, /^\.hero(?:\s+)?h1(?:\s+)?a$/);

    assert.ok(
      copyDecoration !== undefined && /\bunderline\b/i.test(copyDecoration),
      `hero-copy links last text-decoration is ${JSON.stringify(copyDecoration)}`,
    );
    assert.ok(
      headingDecoration !== undefined && /\bunderline\b/i.test(headingDecoration),
      `hero h1 links last text-decoration is ${JSON.stringify(headingDecoration)}`,
    );

    const blanket = lastDecoration(appCss, /^\.hero a$/);
    assert.strictEqual(
      blanket,
      'none',
      'action-pill / generic .hero a may stay un-underlined',
    );
  });
});
