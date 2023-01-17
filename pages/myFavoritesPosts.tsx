import { GetServerSideProps } from "next";
import config from "config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Pagination } from "antd";

type PropsType = { appUrl: string; postsPerPage: number };
type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  geo: string;
  event_time: Date;
  category: string;
  favoriteUsers: { id: number }[];
};

export default function MyFavoritesPostsPage({ appUrl, postsPerPage }: PropsType) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const router = useRouter();

  let page = 1;
  const queryPage = router.query.page;
  if (queryPage && +queryPage) {
    page = +queryPage;
  }

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/favorites`, {
        params: { page },
      });
      res.data.data.posts.forEach((item: { is_favorite: boolean }) => item.is_favorite = true)
      setPosts(res.data.data.posts);
      setTotalCount(res.data.data.count);
    })();
  }, [page, appUrl]);

  const changePageNumber = (page: number) => {
    router.query.page = page + "";
    router.push(router);
  };

  async function changeStar(postId: number) {
    const res = await axios.post(`${appUrl}/api/favorites/${postId}`);
    const currentPosts = posts;
    const foundPost = currentPosts.find((item) => item.id === postId);
    if (!foundPost) {
      return;
    }
    foundPost.is_favorite = res.data.data.isFavorite;
    foundPost.favoriteUsers = [];

    setPosts([...currentPosts]);;
  }

  return (
    <>
      {posts.map((item) => (
        <div key={`post ${item.id}`}>
          {item.favoriteUsers?.length > 0 || item.is_favorite ? (
            <div
              onClick={() => {
                changeStar(item.id);
              }}
            >
              star{" "}
            </div>
          ) : (
            <div
              onClick={() => {
                changeStar(item.id);
              }}
            >
              no star
            </div>
          )}
          {item.category} {item.title} {item.geo} {item.event_time}
          <hr />
        </div>
      ))}

      <Pagination
        current={page}
        total={totalCount}
        defaultPageSize={postsPerPage}
        showSizeChanger={false}
        onChange={changePageNumber}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");
  const postsPerPage = config.get<number>("posts.perPage");

  return {
    props: { appUrl, postsPerPage },
  };
};
