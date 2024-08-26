export interface Subsection {
  id: number;
  sectionId: number;
  name: string;
  weight: number;
  criterion: string;
  result?: number;
}

export interface Section {
  id: number;
  gridId: number;
  name: string;
  weight: number;
  subsections: Subsection[];
}

export interface Grid {
  id: number;
  name: string;
  sections: Section[];
}

export interface Student {
  id: number;
  name: string;
  formation?: string | null;
  mode?: string | null;
  mail?: string | null;
}

export interface CorrectionData {
  id?: number;
  itemId: number;
  labId: number;
  appreciation: string;
  students: Student[];
  sections: Section[];
}

export interface SubsectionInfo {
  id: number;
  name: string;
  criterion: string;
  weight: number;
}

export interface SectionInfo {
  id: number;
  name: string;
  weight: number;
  subsections: SubsectionInfo[];
}

export interface Correction {
  id: number;
  appreciation: string;
  students: Student[];
}

export interface Assistant {
  id: number;
  mail: string;
}

export interface Course {
  id: number;
  name: string;
  year: number;
}
