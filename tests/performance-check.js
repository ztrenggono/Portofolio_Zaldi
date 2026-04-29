const fs = require('node:fs');
const assert = require('node:assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

const scriptTag = html.match(/<script[^>]+src=["']script\.js["'][^>]*>/);
assert.ok(scriptTag, 'script.js tag must exist');
assert.match(scriptTag[0], /\sdefer(\s|>|=)/, 'script.js must use defer to avoid blocking HTML parsing');

const localImages = [...html.matchAll(/<img\b[^>]*\bsrc=["'](assets\/images\/[^"']+)["'][^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => !tag.includes('class="logo-image"'));

assert.ok(localImages.length > 0, 'local content images should be present');

for (const tag of localImages) {
    assert.match(tag, /\bloading=["']lazy["']/, `below-the-fold image should be lazy loaded: ${tag}`);
    assert.match(tag, /\bdecoding=["']async["']/, `below-the-fold image should decode asynchronously: ${tag}`);
}

const externalImages = [...html.matchAll(/<img\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*>/g)].map((match) => match[0]);
assert.ok(externalImages.length > 0, 'external icon images should be present');

for (const tag of externalImages) {
    assert.match(tag, /\bloading=["']lazy["']/, `external image should be lazy loaded: ${tag}`);
    assert.match(tag, /\bdecoding=["']async["']/, `external image should decode asynchronously: ${tag}`);
    assert.match(tag, /\breferrerpolicy=["']no-referrer["']/, `external image should avoid leaking referrers: ${tag}`);
}

const smoothScrollListenerCount = (js.match(/querySelectorAll\(['"]a\[href\^=["']#["']\]['"]\)/g) || []).length;
assert.equal(smoothScrollListenerCount, 1, 'smooth-scroll anchor listeners should be registered once');

assert.doesNotMatch(js, /\.style\.transform\s*=/, 'hover and click animation state should use CSS classes instead of inline transform writes');
assert.match(js, /requestAnimationFrame/, 'scroll UI updates should be batched with requestAnimationFrame');

assert.match(css, /content-visibility:\s*auto/, 'below-the-fold sections should use content-visibility for faster rendering');
assert.match(css, /contain-intrinsic-size:/, 'content-visibility sections need intrinsic size placeholders to reduce layout shift');
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*html\s*\{[\s\S]*scroll-behavior:\s*auto/, 'reduced-motion users should not get smooth scrolling');
