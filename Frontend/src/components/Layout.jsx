import Footer from "./Footer";
import Navbar from "./Navbar";

// Main Layout
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}