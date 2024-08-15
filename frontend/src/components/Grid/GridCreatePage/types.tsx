// components/GridCreatePage/types.ts

export interface SubSection {
    id: string;
    name: string;
    weight: number;
    criterion: string;
  }
  
  export interface Section {
    id: string;
    name: string;
    weight: number;
    subsections: SubSection[];
  }
  