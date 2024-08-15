"use client";
import { fetchGrids } from "@/app/lib/data/grids";
import { useEffect, useState } from "react";
import { Form, ListGroup, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";

const GridPage: React.FC = () => {
  const [grids, setGrids] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
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
            New Grid
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup>
            {filteredGrids.map((grid) => (
              <ListGroup.Item key={grid.id}>{grid.name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default GridPage;
