import type { BrewMethod, BrewMethodCategory } from '@brewmate/shared';

export interface BrewMethodGroup {
  readonly category: BrewMethodCategory;
  readonly methods: readonly BrewMethod[];
}

/**
 * The catalogue split into the families a person shops in.
 *
 * Grouped by the category the row already carries, in the order the API sent
 * them, so the app never decides which family comes first - the catalogue's
 * own `sortOrder` does.
 */
export const groupMethodsByCategory = (
  methods: readonly BrewMethod[],
): readonly BrewMethodGroup[] => {
  const groups = new Map<BrewMethodCategory, BrewMethod[]>();

  for (const method of methods) {
    const existing = groups.get(method.category);

    if (existing === undefined) {
      groups.set(method.category, [method]);

      continue;
    }

    existing.push(method);
  }

  return [...groups].map(
    ([category, grouped]: readonly [
      BrewMethodCategory,
      readonly BrewMethod[],
    ]): BrewMethodGroup => ({
      category,
      methods: grouped,
    }),
  );
};
