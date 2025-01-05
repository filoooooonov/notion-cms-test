export type Tag = {
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  slug: string;
  tags: Tag[];
};
