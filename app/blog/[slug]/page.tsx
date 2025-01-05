import { fetchBySlug, fetchPageBlocks, notion } from "@/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = await fetchBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  const blocks = await fetchPageBlocks(post.id);
  const renderer = new NotionRenderer({
    client: notion,
  });

  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);

  return (
    <div>
      <Link
        href="/"
        className="mb-16 mt-8 flex items-center gap-2 text-neutral-300 font-semibold bg-neutral-800 rounded-md px-2 py-1 w-max hover:bg-neutral-400 hover:text-neutral-900 duration-300"
      >
        <MdOutlineKeyboardArrowLeft /> Home
      </Link>
      {post.cover ? (
        <Image
          src={post.cover}
          alt="post cover image"
          className="w-full h-96 object-cover rounded-xl mb-8"
          width={800}
          height={800}
        />
      ) : (
        <div className="h-96 bg-neutral-800 w-full"></div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-bold">{post.title}</h1>
        <div>
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-neutral-800 text-neutral-300 rounded-md px-2 py-1 mr-2"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <p className="text-neutral-400 mt-4 mb-16">{post.date}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
