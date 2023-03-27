//this wil be the landing page for the app
import Navigation from "../components/navbar";

export default function Homepage() {
    return (
        <div className="container">
            <Navigation />
            <h1>LandingPage</h1>
            <h3>To put here</h3>
            <ul>
                <li>Navbar</li>
                <li>Footer</li>
                <li>explanation what this webapp is prob markdown</li>
                <li>upload data component</li>
            </ul>
        </div>
    );
};
