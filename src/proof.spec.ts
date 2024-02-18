import test from 'ava';

import { CORRECT } from './correctResult';
import { getCategories } from './mockedApi';
import { categoryTree } from './task';

test('categoryTree', async (t) => {
  const actual = await categoryTree({ getAll: getCategories });
  const expected = CORRECT;
  t.deepEqual(actual, expected);
});
