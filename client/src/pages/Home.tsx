import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-dark-950">
      <Sidebar />
      <main className="flex-1 ml-80">
        <Dashboard />
      </main>
    </div>
  );
}
