import Dock from "./_components/DashboardDock";
import Navbar from "./_components/DashboardNavbar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-neutral-50">
      <Navbar />
      {children}
      <Dock />
    </main>
  )
}