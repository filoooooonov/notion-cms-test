import { fetchPages } from "@/lib/notion";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const posts = await fetchPages();

  if (!posts) {
    return <div>No posts found</div>;
  }

  return (
    <main className="p-12 flex flex-row flex-wrap gap-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-neutral-900 rounded-xl p-6 w-max">
          <h2 className="font-semibold text-4xl mb-8">{post.title}</h2>
          <p className="mb-12">{post.date}</p>
          <Link
            href={`/blog/${post.slug}`}
            className="p-2 bg-amber-500 text-black rounded-lg"
          >
            Visit
          </Link>
        </div>
      ))}
    </main>
  );
}
