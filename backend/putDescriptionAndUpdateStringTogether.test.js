const {
  putDescriptionAndUpdateStringTogether,
} = require('./handleWebhookEvent');

test('Put description and update string together', () => {
  expect(
    putDescriptionAndUpdateStringTogether('good run', 'weather was hot')
  ).toBe('good run\n\nweather was hot');
  expect(putDescriptionAndUpdateStringTogether('good run', '')).toBe(
    'good run'
  );
  expect(putDescriptionAndUpdateStringTogether('', 'weather was hot')).toBe(
    'weather was hot'
  );
  expect(putDescriptionAndUpdateStringTogether(null, 'weather was hot')).toBe(
    'weather was hot'
  );
  expect(
    putDescriptionAndUpdateStringTogether(
      'good run\n\nweather was hot',
      'weather was hot'
    )
  ).toBe('good run\n\nweather was hot');
});
