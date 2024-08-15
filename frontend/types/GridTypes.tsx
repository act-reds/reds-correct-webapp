// Define your shared interfaces here
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

export interface GridData {
  name: string;
  course: string;
  year: number;
  sections: Section[];
}
