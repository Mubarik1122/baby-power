import { Category } from './types';

export function getParentId(category: Category): string | null {
  if (!category.parent) return null;
  return typeof category.parent === 'string' ? category.parent : category.parent._id;
}

export function getRootCategories(categories: Category[]): Category[] {
  return categories.filter((category) => !getParentId(category));
}

export function getChildCategories(categories: Category[], parentId: string): Category[] {
  return categories.filter((category) => getParentId(category) === parentId);
}

export function getCategoryOptions(categories: Category[]): Array<{ id: string; label: string }> {
  const options: Array<{ id: string; label: string }> = [];

  for (const root of getRootCategories(categories)) {
    options.push({ id: root._id, label: root.name });
    for (const child of getChildCategories(categories, root._id)) {
      options.push({ id: child._id, label: `— ${child.name}` });
    }
  }

  return options;
}

export function getParentCategoryOptions(
  categories: Category[],
  excludeId?: string
): Category[] {
  return getRootCategories(categories).filter((category) => category._id !== excludeId);
}
