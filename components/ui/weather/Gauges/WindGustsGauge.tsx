import GaugeComponent from '@knowyourdeveloper/react-gauge-component';

interface Props {
  value: number;
  mean: number;
  unit: string;
  colors: string[];
  max: number;
}

export default function WindGustsGauge({ value, mean, unit, colors, max }: Props) {

  const formatTextValue = (value: number) => value + unit;

  const marginInPercent = {
    top: 0.01,
    bottom: 0.01,
    left: 0.11,
    right: 0.11,
  }

  return (
    <GaugeComponent
      key={JSON.stringify(marginInPercent)}
      type='semicircle'
      marginInPercent={marginInPercent}
      arc={{
        nbSubArcs: colors.length,
        colorArray: colors,
        width: 0.1,
        padding: 0.003,
      }}
      labels={{
        valueLabel: {
          style: { fontSize: 40 },
          formatTextValue
        },
        tickLabels: {
          type: "inner",
          ticks: [
            { value: mean, valueConfig: { formatTextValue: v => `Day: ${v} ${unit}` } }
          ],
          defaultTickValueConfig: {
            formatTextValue
          }
        }
      }}
      value={value}
      maxValue={max}
    />
  )
}
