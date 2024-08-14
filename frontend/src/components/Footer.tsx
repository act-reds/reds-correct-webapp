"use client";

import React from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="bg-light text-center py-3 footer">
      <Container>
        <p className="mb-0">© 2024 My Next.js Project</p>
      </Container>
    </footer>
  );
};

export default Footer;
