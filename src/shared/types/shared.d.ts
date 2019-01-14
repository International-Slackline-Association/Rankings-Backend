export interface INamedDiscipline {
  id: number;
  name: string;
}

export interface INamedContestCategory {
  id: number;
  name: string;
}

export interface ISelectOption {
  value: string;
  label: string;
}

export interface UISelectOption extends ISelectOption {
  isContainerStyle?: boolean;
  inlineLevel?: number;
}

export interface ICategoryItem {
  title: string;
  options: UISelectOption[];
  selectedValue: string;
}

// export interface ISelectedCategoryItem {
//   index: number;
//   value: string;
// }
