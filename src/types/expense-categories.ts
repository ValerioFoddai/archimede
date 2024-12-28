export interface MainCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sub_categories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  main_category_id: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
}