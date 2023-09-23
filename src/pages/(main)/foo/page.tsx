import { createLoader, useLoaderData } from "@/utils/loader.util";

export const loader = createLoader(async ({ request, params, store, me }) => {
  return {
    name: "John Doe",
  };
});

export default function Page() {
  const data = useLoaderData<ReturnType<typeof loader>>();
  return (
    <div>
      <h1>Foo Page</h1>
      <p>Hi {data?.name ?? "there"}</p>
    </div>
  );
}
