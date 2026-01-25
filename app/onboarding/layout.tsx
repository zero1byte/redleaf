// app/folder/layout.tsx
export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center w-full">
        {/* Header */}
        <div className="w-full bg-card border-b border-border py-6 sm:py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-foreground">
              Welcome To Redleaf
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Let&apos;s get you started with setting up your account.
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="w-full flex-1 py-4 sm:py-6 md:py-8">
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
