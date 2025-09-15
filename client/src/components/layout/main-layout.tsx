import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-light">
      <Sidebar />
      <div className="md:ml-16 transition-all duration-300">
        <Header title={title} />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
