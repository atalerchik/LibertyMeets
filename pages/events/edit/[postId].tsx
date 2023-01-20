import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import config from "config";
import { GetServerSideProps } from "next";
import styles from "../../../styles/posts.module.css";

type PropsType = { appUrl: string };
type ErrorResponse = {
  status: string;
};
type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  event_time: Date;
  category: string;
  description: string;
  is_public: boolean;
};

export default function EditPost({ appUrl }: PropsType) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [postInfo, setPostInfo] = useState<PostType>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const postId = router.query.postId;
      if (!postId) {
        return;
      }
      try {
        const res = await axios.get(`${appUrl}/api/posts/getPost`, {
          params: { postId },
        });
        setPostInfo(res.data.data);
        formik.setFieldValue("title", res.data.data.title);
        formik.setFieldValue("category", res.data.data.category);
        formik.setFieldValue("description", res.data.data.description);
      } catch (err) {
        const error = err as AxiosError;
        const response = error.response;
        setErrorMessage((response?.data as ErrorResponse).status);
      }
    })();
  }, [appUrl, router]);

  const formik = useFormik({
    initialValues: {
      id: router.query.postId,
      title: "",
      category: "",
      description: "",
    },
    onSubmit: async (values) => {
      const req = await axios.post(`${appUrl}/api/posts/edit`, values, {
        withCredentials: true,
      });
      if (req.status === 200) {
        alert(req.data.data.postId);
        router.push(`${appUrl}/events/${req.data.data.postId}`);
      } else {
        alert();
      }
    },
  });

  return (
    <div className="defaultPage">
      <form className={styles.block} onSubmit={formik.handleSubmit}>
        <div>Edit Post</div>
        <div>
          <input
            name="title"
            placeholder="title"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          <input
            name="description"
            placeholder="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          <select
            name="category"
            onChange={formik.handleChange}
            value={formik.values.category}
          >
            <option value="social">Social</option>
            <option value="volunteer">Volunteer</option>
            <option value="professional">Proffesional</option>
            <option value="campaigns">Сampaigns</option>
          </select>
          {/* <input name="id" value={router.query.postId} hidden={true} /> */}
          <div>
            <button>Cancel</button>
            <button type="submit">Update</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const appUrl = config.get<string>("appUrl");

  return {
    props: { appUrl },
  };
};
