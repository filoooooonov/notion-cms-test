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
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`}>
            <div
              key={post.id}
              className="flex flex-col bg-neutral-900 hover:bg-neutral-800/80 duration-300 rounded-lg overflow-hidden"
            >
              <div className="h-48">
                {post.cover ? (
                  <Image
                    src={post.cover}
                    alt="post cover image"
                    className="w-full h-full object-cover"
                    width={400}
                    height={200}
                  />
                ) : (
                  <div className="h-48 bg-neutral-800 w-full"></div>
                )}
              </div>
              <div className="p-6 ">
                <p className="mb-2 text-neutral-400 text-sm">{post.date}</p>
                <h2 className="font-semibold text-2xl mb-6">{post.title}</h2>
                <p>{post.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
