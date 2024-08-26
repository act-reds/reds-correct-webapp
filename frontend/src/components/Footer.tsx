"use client";

import React from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="bg-light text-center py-3 footer">
      <Container>
        <p className="mb-0">© REDS - Reds correct tool 2024</p>
      </Container>
    </footer>
  );
};

export default Footer;
