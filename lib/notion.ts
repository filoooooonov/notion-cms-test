import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import "server-only";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const fetchPages = React.cache(async () => {
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

  return response.results
    .map((page) => {
      const properties = (page as PageObjectResponse).properties;
      console.log("Page properties:", properties); // Log properties to inspect structure

      const title =
        properties.Name.type === "title"
          ? properties.Name.title[0].plain_text
          : "Untitled";
      const date =
        properties.Date.type === "created_time"
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(properties.Date.created_time))
          : "No date";
      const slug =
        properties.Slug.type === "rich_text"
          ? properties.Slug.rich_text[0]?.plain_text
          : "404";

      return {
        id: page.id,
        title,
        date,
        slug,
      };
    })
    .filter((post) => post.slug);
});

export const fetchBySlug = React.cache((slug: string) => {
  return notion.databases
    .query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    })
    .then((res) => res.results[0] as PageObjectResponse | undefined);
});

export const fetchPageBlocks = React.cache((pageId: string) => {
  return notion.blocks.children
    .list({
      block_id: pageId,
    })
    .then((res) => res.results as BlockObjectResponse[]);
});
