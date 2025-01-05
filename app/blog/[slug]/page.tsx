import { fetchBySlug, fetchPageBlocks, notion } from "@/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";
import Link from "next/link";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await fetchBySlug(params.slug);

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
        className="mb-16 mt-8 flex items-center gap-2 text-neutral-300 bg-neutral-800 rounded-md px-2 py-1 w-max hover:bg-neutral-400 hover:text-neutral-900 duration-300"
      >
        <MdOutlineKeyboardArrowLeft /> Home
      </Link>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
