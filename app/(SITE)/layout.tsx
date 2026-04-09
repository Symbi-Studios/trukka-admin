import { SideBar } from "@/components/layouts/SideBar";
import Navbar from "@/components/site/layout/Navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
        <Navbar />
        {children}
    </div>
  );
}
