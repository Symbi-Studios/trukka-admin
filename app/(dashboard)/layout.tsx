import { SideBar } from "@/components/layouts/SideBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      lang="en"
      className={` h-screen overflow-hidden`}
    >
      <div className="max-h-screen h-full  flex justify-between">
        <SideBar />
        <main className="flex-1 overflow-y-auto h-screen bg-gray-100">
          {children}
        </main>
        </div>
    </div>
  );
}
