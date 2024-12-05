import {Navbar} from './components/Navbar';
import {ReactElement} from "react";

/**
 * App Component
 * Root application component that renders the entire site.
 *
 * @returns {ReactElement}
 */
export function App(): ReactElement {
  return (
      <div>
        {/* Render the site */}
        <Navbar />

        <main>
          <h1>Welcome to Javierlabs!</h1>
          <p>Explore the different sections using the navigation above.</p>
        </main>
      </div>

  );
}
