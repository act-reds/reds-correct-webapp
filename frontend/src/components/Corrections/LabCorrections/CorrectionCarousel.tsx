import React, { useState, useEffect } from "react";
import { Carousel, Button, Form, ListGroup } from "react-bootstrap";
import "./DynamicRectangles.css"; // Import the CSS file
import SectionTableWithInput from "@/components/Grid/SectionTableWithInput";
import SectionTable from "@/components/Grid/SectionTable";
import { CorrectionData, Student } from "../../../../types/CorrectionTypes";

interface Item {
  id: number;
}

interface CorrectionCarouselProps {
  items: Item[];
  activeIndex: number;
  onSelect: (selectedIndex: number) => void;
  onButtonClick: (id: number) => void;
  labId: number;
  handleSlide: () => void;
  setCorrectionData: React.Dispatch<React.SetStateAction<CorrectionData>>;
}

const CorrectionCarousel: React.FC<CorrectionCarouselProps> = ({
  items,
  activeIndex,
  onSelect,
  onButtonClick,
  labId,
  handleSlide,
  setCorrectionData,
}) => {
  const [data, setData] = useState<any>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [sections, setSections] = useState<any[]>([]);

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `/api/data/lab/${labId}/get-correction-data`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const tmpData = await response.json();
        // console.log(tmpData.gridData);
        setData(tmpData);
        setSections(tmpData.gridData);
        setStudents(
          tmpData.classStudents.map((student: any) => ({
            id: student.id,
            name: student.name,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudentData();
  }, []);

  // Handle student selection
  const handleSelectStudent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    if (selectedName) {
      // Find the student by name from the data
      const student = data.classStudents.find(
        (stu: any) => stu.name === selectedName
      );

      if (student) {
        const studentId = student.id;
        // Check if the student is already selected
        if (
          !selectedStudents.some(
            (selectedStudent) => selectedStudent.id === studentId
          )
        ) {
          // Add the student to the selectedStudents array
          setSelectedStudents([
            ...selectedStudents,
            { id: studentId, name: selectedName },
          ]);
        }
        // Clear the selected student dropdown
        setSelectedStudent("");
      }
    }
  };
  const testHandleSlide = () => {
    console.log("Is it the issue ? ");
    handleSlide();
  };
  // Handle student removal
  const handleRemoveStudent = (id: number) => {
    setSelectedStudents(
      selectedStudents.filter((student) => student.id !== id)
    );
  };

  useEffect(() => {
    setCorrectionData((prev: CorrectionData) => ({
      ...prev,
      students: selectedStudents,
    }));
  }, [selectedStudents]);

  return (
    <div>
      <Carousel
        activeIndex={activeIndex}
        onSelect={onSelect}
        interval={null}
        className="carousel-custom" // Apply custom class
        // onSlide={testHandleSlide}
      >
        {items.map((item) => (
          <Carousel.Item key={item.id}>
            <Form.Select
              value={selectedStudent}
              onChange={handleSelectStudent}
              aria-label="Choose student"
            >
              <option value="">Choose student</option>
              {students.map((student) => (
                <option key={student.id} value={student.name}>
                  {student.name}
                </option>
              ))}
            </Form.Select>
            <ListGroup className="mt-3">
              {selectedStudents.map((student) => (
                <ListGroup.Item key={student.id}>
                  {student.name}
                  <Button
                    variant="danger"
                    size="sm"
                    className="float-end"
                    onClick={() => handleRemoveStudent(student.id)}
                  >
                    x
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {sections && selectedStudents.length > 0 && (
              <div>
                <SectionTableWithInput
                  labId={labId}
                  setCorrectionData={setCorrectionData}
                  sections={sections}
                ></SectionTableWithInput>
                <Form.Label>Assistant review</Form.Label>
                <Form.Control as="textarea" rows={8} />
              </div>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CorrectionCarousel;
