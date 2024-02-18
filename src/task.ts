import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export interface CategoriesProvider {
  getAll(): Promise<{ data: Category[] }>;
}

export const categoryTree = async (
  provider: CategoriesProvider
): Promise<CategoryListElement[]> => {
  const { data } = await provider.getAll();

  if (!data) {
    return [];
  }

  return mapCategories(data);
};

const mapCategories = (categories: Category[]): CategoryListElement[] => {
  return categories
    .map((category) => {
      const { order, showOnHome } = resolveOrderAndShowOnHome(category);

      return {
        id: category.id,
        image: category.MetaTagDescription,
        name: category.name,
        order,
        children:
          category.children && category.children.length
            ? mapCategories(category.children)
            : [],
        showOnHome,
      };
    })
    .sort(sortByOrderFn);
};

const sortByOrderFn = (
  a: CategoryListElement,
  b: CategoryListElement
): number => {
  return a.order - b.order;
};

const resolveOrderAndShowOnHome = (
  category: Category
): { order: number; showOnHome: boolean } => {
  if (containsOrderInTitleSeparatedByHashtag(category)) {
    const orderFromTitle = getOrderFromTitleSeparatedByHashtag(category);

    return {
      order: isNaN(orderFromTitle) ? category.id : orderFromTitle,
      showOnHome: true,
    };
  }

  if (containsOrderInTitleAsNumericString(category)) {
    const orderFromTitle = getOrderFromTitleFromNumericString(category);

    return {
      order: isNaN(orderFromTitle) ? category.id : orderFromTitle,
      showOnHome: false,
    };
  }

  return {
    order: category.id,
    showOnHome: false,
  };
};

const containsOrderInTitleSeparatedByHashtag = (
  category: Category
): boolean => {
  return !!category.Title && category.Title.includes('#');
};

const getOrderFromTitleSeparatedByHashtag = (
  category: Category
): number | typeof NaN => {
  return parseInt(category.Title.split('#')[0]);
};

const containsOrderInTitleAsNumericString = (category: Category): boolean => {
  return !!category.Title && !isNaN(parseInt(category.Title));
};

const getOrderFromTitleFromNumericString = (
  category: Category
): number | typeof NaN => {
  return parseInt(category.Title);
};
