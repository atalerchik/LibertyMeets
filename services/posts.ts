import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { PostType } from "../types/general";
import config from "config";

const PAGE_SIZE = config.get<number>("posts.perPage");

export async function savePostToDb({
  user,
  post,
}: {
  user: { id: number; email: string };
  post: PostType;
}) {
  let geo = undefined;
  if (post.lat && post.lng) {
    geo = `${post.lat}N, ${post.lng}W`;
  }

  const createdPost = await Posts.create({
    author_id: user.id,
    title: post.title,
    category: post.category,
    description: post.description,
    is_public: post.isPublic,
    geo: geo,
  });

  await UserPosts.create({ user_id: user.id, post_id: createdPost.id });
  return createdPost;
}

export async function getPosts(
  page: number,
  isUserLoggedIn: boolean
): Promise<{ count: number; posts: Posts[] }> {
  let where = undefined;
  if (!isUserLoggedIn) {
    where = { is_public: true };
  }

  const posts = await Posts.findAll({
    where,
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
  });
  const count = await Posts.count({ where });
  return { count, posts };
}
