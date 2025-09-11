export function formatDate(idIso: string) {
  const d = new Date(idIso);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
