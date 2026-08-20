import type { JSX } from "react";
import { IMoonInfoWithTimes } from "@/utils/weather/getMoonInfo";
import EventProgress from "../EventProgress";

interface Props {
  moonInfo: IMoonInfoWithTimes
}

export default function MoonProgressBar({ moonInfo }: Props): JSX.Element {

  const onDebugClick = (): void => console.info('Moon Progress Bar:', moonInfo);

  return (
    <EventProgress
      start={moonInfo.moonrise.date}
      end={moonInfo.moonset.date}
      startIconName={moonInfo.moonrise.phase.iconName}
      endIconName={moonInfo.moonset.phase.iconName}
      progress={moonInfo.progress}
      onDoubleClick={onDebugClick}
    />
  );
}