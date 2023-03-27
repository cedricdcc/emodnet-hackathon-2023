//this component will be the navbar for the app
import { Nav , Navbar } from "react-bootstrap";

export default function Navigation() {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#/">PROJECT NAME HERE</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#/upload">Upload</Nav.Link>
                        <Nav.Link href="#/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};