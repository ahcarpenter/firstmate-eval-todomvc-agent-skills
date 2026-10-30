import { notFound } from "next/navigation";
import TodoApp from "@/components/TodoApp";
import { FILTERS, type Filter } from "@/lib/todos";

export default async function Page({ params }: { params: Promise<{ id: string; filter?: string[] }> }) {
  const { id, filter } = await params;
  const name = filter?.[0] ?? "all";
  // "all" is the bare list URL, so /lists/<id>/all is not a page.
  if ((filter && (filter.length > 1 || name === "all")) || !FILTERS.includes(name as Filter)) {
    notFound();
  }
  return <TodoApp listId={decodeURIComponent(id)} filter={name as Filter} />;
}
