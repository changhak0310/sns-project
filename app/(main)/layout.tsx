import { MainLayout } from "@/features/app-shell/components/main-layout";

export default function MainRouteLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return <MainLayout modal={modal}>{children}</MainLayout>;
}
