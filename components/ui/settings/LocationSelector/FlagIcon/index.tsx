import Image from "next/image";
import styles from "./FlagIcon.module.css";

interface Props {
  countryCode: string;
  width?: number;
}

/** Bandeira pequena via flagcdn (emojis de bandeira não existem no Windows) */
export default function FlagIcon({ countryCode, width = 20 }: Props) {
  const code = countryCode.trim().toLowerCase();

  return (
    <Image
      className={styles.flag}
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      width={width}
      height={Math.round(width * 0.75)}
      unoptimized
    />
  );
}
