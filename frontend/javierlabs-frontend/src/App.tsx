import {Home} from './pages/Home'
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
        <Home />
      </div>

  );
}
