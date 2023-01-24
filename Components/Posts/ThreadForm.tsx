import axios from "axios";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";

type PropsType = {
  isThreadExists: boolean;
  appUrl: string;
  postId: number;
  isAuthor: boolean | undefined;
  threadUserId: number | undefined;
};

export default function ThreadForm({
  isThreadExists,
  appUrl,
  postId,
  isAuthor,
  threadUserId,
}: PropsType) {
  const { data: session } = useSession();

  if(!threadUserId){
    return(<></>)
  }

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: async (values) => {
      await axios.post(
        `${appUrl}/api/threads/reply`,
        { message: values.message },
        { params: { postId, threadUserId } }
      );
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          name="message"
          placeholder="message"
          onChange={formik.handleChange}
        ></textarea>
        <button type="submit">
          {isThreadExists ? "Send message" : "Start thread"}
        </button>
      </form>
    </>
  );
}