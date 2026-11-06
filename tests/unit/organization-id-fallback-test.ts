import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';
import envExample from '../../.env.example?raw';

const DEMO_ORG_ID = '69ad9c7876d8bf6f864b3a65';

module('Unit | organization id fallback', function () {
  test('empty VITE_ORGANIZATION_ID falls back to the public demo org', function (assert) {
    assert.true(
      new RegExp(
        `const DEFAULT_EXAMPLE_ORG_ID = '${DEMO_ORG_ID}'`,
      ).test(demoSource),
      'demo declares the public demo org used by sibling Connect examples',
    );
    assert.true(
      /VITE_ORGANIZATION_ID\s*\|\|\s*DEFAULT_EXAMPLE_ORG_ID/.test(demoSource),
      'empty or missing VITE_ORGANIZATION_ID must fall back to the demo org, not empty string',
    );
    assert.false(
      /VITE_ORGANIZATION_ID\s*\|\|\s*['"]{2}/.test(demoSource),
      'demo must not coerce a missing organization id to an empty string',
    );
    assert.true(
      /s\.dataset\.organizationId = ORG/.test(demoSource),
      'mountEmbed still writes the resolved ORG onto the embed script',
    );
    assert.true(
      new RegExp(`^VITE_ORGANIZATION_ID=${DEMO_ORG_ID}$`, 'm').test(envExample),
      '.env.example documents the demo org so optional env copy still works',
    );
    assert.strictEqual(DEMO_ORG_ID.length, 24);
  });
});
