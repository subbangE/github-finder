import Navbar from "./components/layout/Navbar";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import About from "./components/pages/About";
import { GithubProvider } from "./context/github/GithubContext";
import { AlertProvider } from "./context/alert/AlertContext";
import Alert from "./components/layout/Alert";
import User from "./components/pages/User";

function App() {
  return (
    <AlertProvider>
      <GithubProvider>
        <BrowserRouter>
          <div className="flex flex-col justify-between h-screen">
            <Navbar />
            <main className="container mx-auto px-3 pb-12">
              <Alert />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/user/:login" element={<User />} />
                <Route path="/notfound" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </GithubProvider>
    </AlertProvider>
  );
}

export default App;
