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
  snapToMultiples?: boolean;
}

export default function Slider({
  id,
  min,
  max,
  step,
  value,
  unit,
  onChange,
  onCommit,
  snapToMultiples = false,
}: Props) {
  const fillPercentage = ((value - min) / (max - min)) * 100;

  const getValidValues = () => {
    if (!snapToMultiples || !step) return null;

    const values = [min];

    for (let current = step; current < max; current += step) {
      if (current > min) values.push(current);
    }

    if (values[values.length - 1] !== max) {
      values.push(max);
    }

    return values;
  };

  const validValues = getValidValues();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = Number(e.target.value);

    if (!validValues) {
      onChange(rawValue);
      return;
    }

    const closest = validValues.reduce((prev, current) =>
      Math.abs(current - rawValue) < Math.abs(prev - rawValue)
        ? current
        : prev
    );

    onChange(closest);
  };

  const handleCommit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!onCommit) return;

    const rawValue = Number((e.target as HTMLInputElement).value);

    if (!validValues) {
      onCommit(rawValue);
      return;
    }

    const closest = validValues.reduce((prev, current) =>
      Math.abs(current - rawValue) < Math.abs(prev - rawValue)
        ? current
        : prev
    );

    onCommit(closest);
  };

  return (
    <div className={styles.sliderRow}>
      <input
        id={id}
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={snapToMultiples ? 1 : step}
        value={value}
        onChange={handleChange}
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
  );
}