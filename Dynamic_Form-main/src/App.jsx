import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormList from "./pages/FormList";
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import EntryDetail from "./pages/EntryDetail";
import FormEntries from "./pages/FormEntries";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px", width: "100%"}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forms" element={<FormList />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/edit/:id" element={<CreateForm />} />
          <Route path="/preview/:id" element={<PreviewForm />} />
          <Route path="/entries/:id" element={<FormEntries />} />
          <Route path="/entry/:formId/:entryId" element={<EntryDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
