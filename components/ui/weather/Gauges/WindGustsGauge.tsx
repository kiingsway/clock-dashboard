import GaugeComponent, { Arc, Labels, TickLabels } from '@knowyourdeveloper/react-gauge-component';

interface Props {
  value: number;
  valueColor?: string
  mean?: number;
  unit: string;
  max: number;
  subArcs: { limit: number; color: string }[]
}

export default function WindGustsGauge({ value, valueColor, mean, unit, subArcs, max }: Props) {

  const formatTextValue = (value: number) => value + unit;

  const marginInPercent = {
    top: 0.01,
    bottom: 0.01,
    left: 0.11,
    right: 0.11,
  }

  const arc: Arc = {
    width: 0.13,
    padding: 0.003,
    subArcs
  }

  const ticks: TickLabels['ticks'] = !mean ? [] : [
    { value: mean, valueConfig: { formatTextValue: v => `Day: ${v} ${unit}` } }
  ]

  const labels: Labels = {
    valueLabel: {
      style: { fontSize: 40, fill: valueColor },
      formatTextValue
    },
    tickLabels: {
      type: "inner",
      ticks,
      defaultTickValueConfig: {
        formatTextValue
      }
    }
  }

  return (
    <GaugeComponent
      key={JSON.stringify({ marginInPercent, arc, labels, value, max })}
      type='semicircle'
      marginInPercent={marginInPercent}
      arc={arc}
      labels={labels}
      value={value}
      maxValue={max}
    />
  )
}
