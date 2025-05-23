import Container from "../../../core/components/Container";
import DashboardPageLayout from "../../../core/layout/DashboardPageLayout";
import UserDetailsSection from "../components/settings/UserDetailsSection";

export default function UserSettingsPage() {
  return (
    <DashboardPageLayout title="Ajustes de Usuario">
      <div className="grid grid-cols-5 grid-rows-7 gap-4">
        <UserDetailsSection />
        <Container className="col-span-3 row-span-2 col-start-1 row-start-3">
          2
        </Container>
        <Container className="col-span-2 row-span-2 col-start-4 row-start-1">
          3
        </Container>
        <Container className="col-span-2 row-span-2 col-start-4 row-start-3">
          4
        </Container>
        <Container className="col-span-5 row-span-3 row-start-5">5</Container>
      </div>
    </DashboardPageLayout>
  );
}
