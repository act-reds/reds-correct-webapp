"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import styles from "./QuickSelectLab.module.css"; // Import custom styles

// Dynamically import react-select to handle client-side rendering only
const Select = dynamic(() => import("react-select"), { ssr: false });

interface QuickSelectLabProps {
  assistantMail: string;
}

interface LabInfo {
  courseName: string;
  courseYear: number;
  courseId: number;
  className: string;
  classId: number;
  labName: string;
  labId: number;
}

const QuickSelectLab: React.FC<QuickSelectLabProps> = ({ assistantMail }) => {
  const [labs, setLabs] = useState<LabInfo[]>([]);
  const [selectedLab, setSelectedLab] = useState<LabInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch labs for the assistant
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch(
          `/api/data/get-display-lab-info?assistantMail=${encodeURIComponent(
            assistantMail
          )}`
        );
        const data = await response.json();
        if (data.labs) {
          setLabs(data.labs);
        } else {
          setApiError("Failed to load labs.");
        }
      } catch (error) {
        console.error("Error fetching labs:", error);
        setApiError("Error fetching labs.");
      } finally {
        setLoading(false);
      }
    };

    if (assistantMail) {
      fetchLabs();
    }
  }, [assistantMail]);

  // Handle lab selection from react-select dropdown
  const handleSelectChange = (selectedOption: any) => {
    const lab = labs.find((lab) => lab.labId === selectedOption.value);
    setSelectedLab(lab || null);
  };

  // Handle "Go" button click
  const handleGoClick = () => {
    if (selectedLab) {
      const {
        courseName,
        courseYear,
        classId,
        className,
        labName,
        labId,
        courseId,
      } = selectedLab;
      router.push(
        `/corrections/${courseName}/${courseYear}/${courseId}/${className}/${classId}/${labName}/${labId}`
      );
    }
  };

  return (
    <Form className={styles.formContainer}>
      {loading ? (
        <div className={styles.spinnerWrapper}>
          <Spinner animation="border" />
        </div>
      ) : apiError ? (
        <Alert variant="danger" className={styles.alert}>
          {apiError}
        </Alert>
      ) : (
        <Row className={styles.row}>
          <Col xs={12} md={2} className={styles.labelCol}>
            <Form.Label className={styles.label}>Quick select a lab</Form.Label>
          </Col>
          <Col xs={12} md={8} className={styles.selectCol}>
            <Select
              options={labs.map((lab) => ({
                value: lab.labId,
                label: `${lab.courseName}-${lab.courseYear}${lab.className}-${lab.labName}`,
              }))}
              onChange={handleSelectChange}
              placeholder="Search and select a lab"
              className={styles.select}
              classNamePrefix="select" // Ensure styles are applied correctly
            />
          </Col>
          <Col xs={12} md={1} className={styles.buttonCol}>
            <Button
              variant="primary"
              type="button"
              onClick={handleGoClick}
              disabled={!selectedLab}
              className={styles.button}
            >
              Go
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default QuickSelectLab;
