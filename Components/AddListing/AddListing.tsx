import { Button } from "antd";
import styles from "./AddListing.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function AddListing() {
  return (
    <div className={styles.container}>
      <div className={styles.noCriteria}>
        No Further Opportunities Meet This Criteria
      </div>
      <div className={styles.title}>Add Your Listing</div>
      <Link className={styles.link} href={"/createPost"}>
        <Button className={styles.createPost}>
          <Image
            src="/decor/Vector3.svg"
            alt=""
            width={16}
            height={14}
            className={styles.vector}
          />
          <span className={styles.buttonText}>Create Post</span>
        </Button>
      </Link>
    </div>
  );
}