export interface Subsection {
  id: number;
  sectionId: number;
  name: string;
  weight: number;
  criterion: string;
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

export interface SubsectionMark {
  subsectionId: number;
  result: number;
}

export interface CorrectionData {
  itemId: number;
  labId: number;
  appreciation: string;
  students: Student[];
  subsectionMarks: SubsectionMark[];
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
