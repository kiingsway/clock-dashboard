import type { JSX } from "react";
import { IMoonInfoWithTimes } from "@/utils/weather/getMoonInfo";
import EventProgress from "../EventProgress";

interface Props {
  moonInfo: IMoonInfoWithTimes
  moonIconName: string;
}

export default function MoonProgressBar({ moonInfo, moonIconName }: Props): JSX.Element {

  const onDebugClick = (): void => console.info('Moon Progress Bar:', moonInfo);

  return (
    <EventProgress
      start={moonInfo.moonrise}
      end={moonInfo.moonset}
      startIconName={moonIconName}
      endIconName={moonIconName}
      progress={moonInfo.progress}
      onDoubleClick={onDebugClick}
    />
  );
}