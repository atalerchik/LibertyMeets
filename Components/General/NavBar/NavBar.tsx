import { Button, Input } from "antd";
import styles from "./NavBar.module.scss";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { CATEGORIES } from "../../../constants/constants";

type NavBarProps = {
  setCategory: Dispatch<SetStateAction<string | undefined>>;
  changePageNumber: (page: number) => void;
};

export default function NavBar(props: NavBarProps) {
  const { setCategory, changePageNumber } = props;

  return (
    <div className={styles.navbar}>
      <div className={styles.tabs}>
        {CATEGORIES.map((item, index) => (
          <Button
            className={styles.button}
            key={index}
            onClick={() => {
              setCategory(item);
              changePageNumber(1);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className={styles.location}>
        <div className={styles.radius}>
          <span className={styles.text}>Radius</span>
          <Input
            suffix={<Image src="/decor/mi.svg" alt="" width={16} height={16} />}
            placeholder="50mi"
            className={styles.mi}
          />
        </div>
        <div className={styles.place}>
          <span className={styles.text}>Zip Code</span>
          <Input
            suffix={
              <Image src="/decor/location2.svg" alt="" width={18} height={18} />
            }
            placeholder="20103"
            className={styles.loc}
          />
        </div>
      </div>
    </div>
  );
}
