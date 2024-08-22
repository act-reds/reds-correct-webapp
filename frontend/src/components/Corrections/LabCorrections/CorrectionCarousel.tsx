import React, { useState, useEffect } from "react";
import { Carousel, Button, Form, ListGroup } from "react-bootstrap";
import SectionTableWithInput from "@/components/Grid/SectionTableWithInput";
import SectionTable from "@/components/Grid/SectionTable";
import { CorrectionData, Student } from "../../../../types/CorrectionTypes";
import "./DynamicRectangles.css";

interface CorrectionCarouselProps {
  correctionData: CorrectionData[];
  activeIndex: number;
  onSelect: (selectedIndex: number) => void;
  onButtonClick: (id: number) => void;
  labId: number;
  handleSlide: () => void;
  setCorrectionData: React.Dispatch<React.SetStateAction<CorrectionData[]>>;
}

const CorrectionCarousel: React.FC<CorrectionCarouselProps> = ({
  correctionData,
  activeIndex,
  onSelect,
  onButtonClick,
  labId,
  handleSlide,
  setCorrectionData,
}) => {
  const [data, setData] = useState<any>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>(
    correctionData[activeIndex].students
  );
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [sections, setSections] = useState<any[]>([]);
  const [assistantReview, setAssistantReview] = useState<string>(
    correctionData[activeIndex].appreciation
  );

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `/api/data/lab/${labId}/get-correction-data`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const tmpData = await response.json();
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
  }, [labId]);

  const getSelectedStudentIds = () => {
    const allSelectedIds = correctionData
      .flatMap((item) => item.students)
      .map((student) => student.id);

    return new Set(allSelectedIds);
  };

  const handleSelectStudent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    if (selectedName) {
      const student = data.classStudents.find(
        (stu: any) => stu.name === selectedName
      );
      if (student && !selectedStudents.some((s) => s.id === student.id)) {
        setSelectedStudents((prev) => [
          ...prev,
          { id: student.id, name: selectedName },
        ]);
        setSelectedStudent("");
      }
    }
  };

  const handleRemoveStudent = (id: number) => {
    setSelectedStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAssistantReview(event.target.value);
  };

  useEffect(() => {
    setCorrectionData((prevCorrectionData) =>
      prevCorrectionData.map((item, index) => {
        if (index === activeIndex) {
          return {
            ...item,
            appreciation: assistantReview,
            students: selectedStudents,
          };
        }
        return item;
      })
    );
  }, [selectedStudents, assistantReview, activeIndex]);

  // Get a Set of IDs of all students already selected
  const selectedStudentIds = getSelectedStudentIds();

  return (
    <div>
      <Carousel
        className="carousel-custom"
        activeIndex={activeIndex}
        onSelect={onSelect}
        interval={null}
      >
        {correctionData.map((correction, index) => (
          <Carousel.Item key={correction.itemId}>
            <Form.Select
              value={selectedStudent}
              onChange={handleSelectStudent}
              aria-label="Choose student"
            >
              <option value="">Choose student</option>
              {students
                .filter((student) => !selectedStudentIds.has(student.id))
                .map((student) => (
                  <option key={student.id} value={student.name}>
                    {student.name}
                  </option>
                ))}
            </Form.Select>
            <ListGroup className="mt-3">
              {correction.students.map((student) => (
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
            {sections && correction.students.length > 0 && (
              <div>
                <SectionTableWithInput
                  labId={labId}
                  activeId={activeIndex}
                  correctionData={correctionData}
                  setCorrectionData={setCorrectionData}
                  sections={sections}
                />
                <Form.Label>Assistant review</Form.Label>
                <Form.Control
                  value={assistantReview}
                  onChange={handleReviewChange}
                  as="textarea"
                  rows={8}
                />
              </div>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CorrectionCarousel;
