import { ReactNode } from "react";
import Spinner from "../components/Spinner";

type DashboardPageProps = {
  className?: string;
  title: string;
  children: ReactNode;
  loading?: boolean;
};

export default function DashboardPageLayout({
  className = "flex flex-col gap-6",
  title,
  children,
  loading = false,
}: DashboardPageProps) {
  if (loading) return <Spinner />;

  return (
    <main className={className}>
      <h1>{title}</h1>
      {children}
    </main>
  );
}
