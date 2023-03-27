//this page will be displayed when the user tries to access a page that does not exist

import Navigation from "../components/navbar";

export default function NotFoundPage() {
    return (
        <div className="container">
            <Navigation/>
            <h1>404</h1>
            <h3>Page not found</h3>
        </div>
    );
};
