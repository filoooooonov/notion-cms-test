import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import "server-only";
import { NotionToMarkdown } from "notion-to-md";
import { BlogPost } from "@/@types/schema";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
export const n2m = new NotionToMarkdown({ notionClient: notion });

function pageToPostTransformer(page: any): BlogPost {
  let cover = page.cover;

  switch (cover.type) {
    case "file":
      cover = page.cover.file;
      break;
    case "external":
      cover = page.cover.external.url;
      break;
    default:
      cover = "";
  }

  return {
    id: page.id,
    cover: cover,
    title: page.properties.Name.title[0].plain_text,
    tags: page.properties.Tags.multi_select,
    description: page.properties.Description.rich_text[0].plain_text,
    date: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(page.properties.Date.created_time)),
    slug: page.properties.Slug.formula.string,
  };
}

export const fetchPages = async () => {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      status: {
        equals: "Live",
      },
    },
  });

  return response.results.map((page) => {
    // transform the response to a blog post
    return pageToPostTransformer(page);
  });
};

//   const properties = (page as PageObjectResponse).properties;
//   console.log("Page properties:", properties); // Log properties to inspect structure

//   const title =
//     properties.Name.type === "title"
//       ? properties.Name.title[0].plain_text
//       : "Untitled";
//   const date =
//     properties.Date.type === "created_time"
//       ? new Intl.DateTimeFormat("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         }).format(new Date(properties.Date.created_time))
//       : "No date";
//   const slug =
//     properties.Slug.type === "rich_text"
//       ? properties.Slug.rich_text[0]?.plain_text
//       : "404";

//   return {
//     id: page.id,
//     title,
//     date,
//     slug,
//   };
// })
// .filter((post) => post.slug);

export const fetchBySlug = React.cache(async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    },
  });

  const page = response.results[0] as PageObjectResponse | undefined;

  return page ? pageToPostTransformer(page) : null;
});

export const fetchPageBlocks = React.cache((pageId: string) => {
  return notion.blocks.children
    .list({
      block_id: pageId,
    })
    .then((res) => res.results as BlockObjectResponse[]);
});
