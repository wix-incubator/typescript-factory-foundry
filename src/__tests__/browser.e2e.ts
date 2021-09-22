import Counter from '../counter';

declare const counter: { default: Counter };

test('happy flow', async () => {
  await page.goto('http://localhost:3100');

  const count = await page.evaluate(() => {
    counter.default.increment();
    counter.default.increment();
    counter.default.increment();

    return counter.default.getCount();
  });

  expect(count).toBe(3);
});
