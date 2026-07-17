import getMoonPhase from "@/utils/weatherIcons/getMoonPhase";
import type { JSX } from "react";

interface Props {

}

export default function MoonStatus(): JSX.Element {

  const illumination = getMoonPhase();

  return (
    <div>
      {illumination.icon}
    </div>
  )
}
