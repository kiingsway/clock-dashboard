import styles from './Slider.module.scss';

interface Props {
  id?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
}

export default function Slider({ id, min, max, step, value, unit, onChange, onCommit }: Props) {
  const fillPercentage = ((value - min) / (max - min)) * 100;

  const handleCommit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (onCommit) {
      onCommit(Number((e.target as HTMLInputElement).value));
    }
  };

  return (
    <div className={styles.sliderRow}>
      <input
        id={id}
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={handleCommit}
        onKeyUp={handleCommit}
        onBlur={handleCommit}
        aria-valuetext={`${value} ${unit}`}
        style={
          {
            "--slider-fill": `${fillPercentage}%`,
          } as React.CSSProperties
        }
      />
      <div className={styles.sliderScale}>
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}
