import { Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import Home from "./pages/home.jsx";
import Features from "./pages/features.jsx";
import Contact from "./pages/contact.jsx";
import Notes from "./pages/notes.jsx";
import { ToastProvider } from "./components/toast.jsx";

export default function App() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
