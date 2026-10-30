import { notFound } from "next/navigation";
import TodoApp from "@/components/TodoApp";
import type { Filter } from "@/lib/todos";

const LIST_FILTERS: Filter[] = ["active", "completed"];

export default async function Page({ params }: { params: Promise<{ id: string; filter?: string[] }> }) {
  const { id, filter } = await params;
  if (filter && (filter.length > 1 || !LIST_FILTERS.includes(filter[0] as Filter))) {
    notFound();
  }
  // Lists live in the browser, so TodoApp checks the id once it has read storage.
  return <TodoApp key={id} listId={id} filter={(filter?.[0] as Filter) ?? "all"} />;
}
