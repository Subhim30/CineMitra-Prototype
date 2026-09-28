import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <Navbar />

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

export default Layout;