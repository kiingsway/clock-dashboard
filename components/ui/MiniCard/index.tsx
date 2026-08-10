import { ReactNode, isValidElement, cloneElement, ReactElement } from "react";
import styles from './MiniCard.module.scss';

interface Props {
  icon?: ReactNode;
  icons?: ReactNode[];
  size?: number;
  title?: string;
  desc?: string;
  onDoubleClick?: () => void;
}

export default function MiniCard({ icon, icons, size = 48, title, desc, onDoubleClick }: Props) {
  const hasIcons = icons && icons.length > 0;

  const renderIconStack = () => {
    if (!icons?.length) return null;

    // const slice = size / icons.length; // soma das partes = size total do card
    const slice = size / 1.3; // soma das partes = size total do card

    return (
      <div className={styles.iconStack} style={{ width: size, height: size }}>
        {icons.map((iconNode, index) => {
          // injeta o size calculado no ícone, se ele for um elemento React válido
          const sizedIcon = isValidElement(iconNode)
            ? cloneElement(iconNode as ReactElement<{ size: number }>, { size: slice })
            : iconNode;

          const offset = (index * slice) / 2.4; // deslocamento diagonal

          return (
            <div
              key={index}
              className={styles.iconLayer}
              style={{
                zIndex: icons.length - index, // primeiro ícone = maior prioridade
                top: offset,
                left: offset,
              }}
            >
              {sizedIcon}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.card} onDoubleClick={onDoubleClick}>
      <div className={styles.icon}>
        {hasIcons ? renderIconStack() : icon}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
    </div>
  );
}