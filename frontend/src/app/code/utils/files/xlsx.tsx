import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";

// Define the type for the students state
interface Student {
  name: string;
  formation: string;
  mode: string;
  mail: string;
}

// Define the type for the file data state
type FileData = any[][];

// Define the handler function
export const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>, // Ensure this is HTMLInputElement
  setFileData: Dispatch<SetStateAction<any[][]>>,
  setStudents: Dispatch<SetStateAction<any[]>>
) => {
  console.log("TEST");
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setFileData(json as FileData);
      setStudents(
        json.slice(1).map((row: any[]) => ({
          name: row[0],
          formation: row[1],
          mode: row[2],
          mail: row[3],
        }))
      );
    };
    reader.readAsArrayBuffer(file);
  }
}
