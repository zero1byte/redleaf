// app/folder/layout.tsx
export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-2 flex flex-col gap-6 items-center justify-center w-full min-h-screen">
        <div className="w-full pt-6">
          <h1 className="font-bold text-2xl">
            <center>
              Welcome To Redleaf
            </center>
          </h1>
          <p className="text-center">
            Let's get you started with setting up your account.
          </p>
        </div>
        <hr className="border-border w-1/2"/>
        <div className="flex items-center flex-col justify-center w-full">
          <div className="lg:w-1/3 w-full  border-0 border-border rounded-lg p-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
