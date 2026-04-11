import { AuthActionArea } from "@/features/auth/components/auth-action-area";
import { MainLayout } from "@/features/app-shell/components/main-layout";

export default function MainRouteLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <MainLayout
      modal={modal}
      headerAuthAction={
        <AuthActionArea loginHref="/login" profileHref="/u/preview-user" />
      }
      sidebarAuthAction={
        <AuthActionArea loginHref="/login" profileHref="/u/preview-user" />
      }
    >
      {children}
    </MainLayout>
  );
}
