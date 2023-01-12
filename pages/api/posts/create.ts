import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { savePostToDb } from "../../../services/posts";
import { PostType } from "../../../types/general";
import { connect } from "../../../utils/db";
import { HttpError } from "../../../utils/HttpError";
import config from "config";
import { Session } from "next-auth";

type resType = {
  status: string;
  data: any;
};

type bodyType = PostType;

connect();
const CATEGORIES = ["social", "volunteer", "professional", "camping"];
const APP_URL = config.get<string>("appUrl");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<resType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const body = req.body as bodyType;
    const { title, category, description } = body;

    if (title.length < 4 || title.length > 28) {
      throw new HttpError(400, "invalid title length");
    }

    if (!CATEGORIES.includes(category)) {
      throw new HttpError(400, "invalid category");
    }

    if (description.length < 4 || description.length > 1024) {
      throw new HttpError(400, "invalid description length");
    }

    const response = await axios.get(`${APP_URL}/api/auth/session`, {
      headers: { Cookie: req.headers.cookie },
    });

    const session = response.data as Session;
    if (!session || Object.keys(session).length === 0) {
      res.status(401);
      return;
    }

    const post = await savePostToDb({ user: session.user, post: body });
    res.status(200).json({ status: "ok", data: { postId: post.id } });
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
}
