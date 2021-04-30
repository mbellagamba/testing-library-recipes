import "./App.css";
import octopus from "./assets/octopus.svg";
import alembic from "./assets/alembic.svg";
import testTube from "./assets/test-tube.svg";

export default function App(): JSX.Element {
  return (
    <div className="app">
      <header>
        <h1>Testing Library Recipes - Getting Started</h1>
      </header>
      <main>
        <div>
          <img
            src={octopus}
            className="icon"
            alt="octopus"
            width="100"
            height="100"
          />
          <img
            src={alembic}
            className="icon"
            alt="alembic"
            width="100"
            height="100"
          />
          <img
            src={testTube}
            className="icon"
            alt="test tube"
            width="100"
            height="100"
          />
        </div>
      </main>
      <footer>
        Made with <span title="<3">&lt;0011</span> by{" "}
        <a href="https://mircobellagamba.com">Mirco Bellagamba</a>
      </footer>
    </div>
  );
}
