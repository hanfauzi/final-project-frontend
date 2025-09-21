export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-sm mx-auto min-h-[calc(100vh-48px)] px-3 py-4">
      {children}
    </main>
  )
}