import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { handleLogIn } from "../app/code/utils/login";

const Header: React.FC = () => {
  const { data: session, status } = useSession(); // Include status to handle loading state

  useEffect(() => {
    const handleSessionChange = async () => {
      if (status === "authenticated" && session) {
        // User is authenticated, add them as an assistant
        try {
          const response = await fetch("/api/data/add-assistant", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user?.email }),
          });

          const data = await response.json();

          console.log(data.message);
        } catch (error) {
          console.error("Error adding assistant:", error);
        }
      }
    };

    handleSessionChange();
  }, [status]); // Dependency array includes session and status

  const navLinks = session
    ? [
        { href: "/corrections", label: "Corrections" },
        { href: "/manage", label: "Manage" },
        { href: "/grids", label: "Grids" },
        { href: "#help", label: "Help" },
      ]
    : [];

  const button = session ? (
    <Button
      variant="secondary"
      onClick={() => signOut({ callbackUrl: "/" })} // Redirect to "/" after logout
    >
      Log out
    </Button>
  ) : (
    <Button variant="primary" onClick={handleLogIn}>
      Log in
    </Button>
  );

  return (
    <>
      <Navbar sticky="top" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">REDS Correct</Navbar.Brand>
          <Nav className="me-auto">
            {navLinks.map((link, index) => (
              <Nav.Link key={index} href={link.href}>
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          <div className="d-flex align-items-center">
            {session && (
              <span className="text-white me-3">{session.user?.email}</span>
            )}
            {button}
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
``;
