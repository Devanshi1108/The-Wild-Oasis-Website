import { auth } from "../_lib/auth";

export const metadata = {
  title: "Guest Area",
};

async function page() {
  const session = await auth();
  const firstname = session?.user?.name.split(" ")[0];

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Welcome, {firstname.toUpperCase()}
      </h2>
    </div>
  );
}

export default page;
