"use client";
import { fetchGrids } from "@/app/lib/data/grids";
import { getGridSections } from "@/app/lib/data/lab";
import { useEffect, useState } from "react";
import {
  Form,
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import GridAccordion from "@/components/Grid/GridAccordion";

const GridPage: React.FC = () => {
  const [grids, setGrids] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sections, setSections] = useState<{ [key: number]: any[] }>({});
  const [loadingSections, setLoadingSections] = useState<{
    [key: number]: boolean;
  }>({});
  const router = useRouter();

  useEffect(() => {
    async function loadGrids() {
      const allGrids = await fetchGrids();
      setGrids(allGrids);
    }

    loadGrids();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredGrids = grids.filter((grid) =>
    grid.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewGridClick = () => {
    router.push("/grids/create");
  };

  const handleAccordionSelect = async (
    eventKey: string | null,
    gridId: number
  ) => {
    // If sections already loaded for this grid, skip fetching
    if (sections[gridId]) return;

    setLoadingSections((prev) => ({ ...prev, [gridId]: true }));

    const fetchedSections = await getGridSections(gridId);
    setSections((prev) => ({ ...prev, [gridId]: fetchedSections }));
    setLoadingSections((prev) => ({ ...prev, [gridId]: false }));
  };
  return (
    <Container>
      <Row className="align-items-center mb-3">
        <Col xs={9}>
          <Form.Group className="mb-0">
            <Form.Control
              type="text"
              placeholder="Search grids..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col xs={2} className="text-end">
          <Button variant="light" onClick={handleNewGridClick}>
            New grid
          </Button>
        </Col>
      </Row>
      <Row>
        <GridAccordion grids={grids} filteredGrids={filteredGrids} />
      </Row>
    </Container>
  );
};

export default GridPage;
