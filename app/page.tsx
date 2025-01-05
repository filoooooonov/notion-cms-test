import { fetchPages } from "@/lib/notion";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

export default async function Home() {
  const posts = await fetchPages();

  if (!posts) {
    return <div>No posts found</div>;
  }

  return (
    <main className="p-12 flex flex-col gap-16">
      <h1 className="text-6xl font-bold">Blog</h1>
      <div className="flex flex-row flex-wrap gap-8">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`}>
            <div
              key={post.id}
              className="bg-neutral-900 hover:bg-neutral-800 duration-300 rounded-lg p-6 w-max"
            >
              {/* <Image /> */}
              <p className="mb-2 text-neutral-400 text-sm">{post.date}</p>
              <h2 className="font-semibold text-2xl mb-6">{post.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
