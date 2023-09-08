import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => (
  <div>
    <div className="Hello">
      <img width="200" alt="icon" src={icon} />
    </div>
    <h1>electron-react-boilerplate</h1>
    <div className="Hello">
      <a
        href="https://github.com/sponsors/electron-react-boilerplate"
        target="_blank"
        rel="noreferrer"
      >
        <button type="button">
          <span role="img" aria-label="folded hands">
            🙏
          </span>
          Donate
        </button>
      </a>
    </div>
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Hello />} />
    </Routes>
  </Router>
);
export default App;
