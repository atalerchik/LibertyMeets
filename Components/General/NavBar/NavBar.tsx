import { Button, Input } from "antd";
import styles from "./NavBar.module.scss";
import Image from "next/image";
import { CATEGORIES } from "../../../constants/constants";
import { useRouter } from "next/router";
import {  useSession } from "next-auth/react";
import { KEY_LAT, KEY_LNG } from "../../../constants/constants";
import axios from "axios";
import { Dispatch, SetStateAction,  useState } from "react";

type NavBarProps = {
  appUrl: string;
  setLat: Dispatch<SetStateAction<number | undefined>>;
  setLng: Dispatch<SetStateAction<number | undefined>>;
  changeCategory: (category: string) => void;
  searchByZipCode: (zipCode: string) => void;
  searchByRadius: (radius: string) => void;
};

const geoLocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export default function NavBar(props: NavBarProps) {
  const {
    appUrl,
    setLat,
    setLng,
    changeCategory,
    searchByZipCode,
    searchByRadius,
  } = props;
  const [checkLat, setCheckLat] = useState<number>();
  const [checkLng, setCheckLng] = useState<number>();
  const session = useSession();
  const router = useRouter();
  const categoryList = {
    "undefined ": "All",
    "Social ": "Social",
    "Volunteer ": "Volunteer",
    "Professional ": "Professional",
    "Campaigns ": "Campaigns",
  };

  async function success(position: {
    coords: { latitude: number; longitude: number };
  }) {
    setCheckLat(position.coords.latitude);
    setCheckLng(position.coords.longitude);
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
    localStorage.setItem(KEY_LAT, position.coords.latitude.toString());
    localStorage.setItem(KEY_LNG, position.coords.longitude.toString());
    await axios.post(
      `${appUrl}/api/users/update`,
      { location: [position.coords.latitude, position.coords.longitude] },
      {
        withCredentials: true,
      }
    );
  }

  function error(err: { code: any; message: any }) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  async function getUserCoordinate() {
    if (checkLat && checkLng) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      success,
      error,
      geoLocationOptions
    );
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.tabs}>
        {CATEGORIES.map((item, index) => (
          <Button
            className={
              categoryList[
                `${router.query.category?.toString() as keyof object} `
              ] === item
                ? styles.activeButton
                : styles.button
            }
            key={index}
            onClick={() => {
              changeCategory(item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className={styles.location}>
        <div
          className={
            session.status === "authenticated" ? styles.radius : styles.disable
          }
        >
          <span className={styles.text}>Radius</span>
          <Input
            onClick={getUserCoordinate}
            suffix={<Image src="/decor/mi.svg" alt="" width={16} height={16} />}
            placeholder="50mi"
            className={styles.mi}
            onChange={(e) => searchByRadius(e.target.value)}
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
            onChange={(e) => searchByZipCode(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
