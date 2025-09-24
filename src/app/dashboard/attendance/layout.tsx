export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-sm md:max-w-[800px]">
      {children}
    </main>
  )
}