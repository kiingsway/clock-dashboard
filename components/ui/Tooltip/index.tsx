import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  disabled?: boolean;
  /**
   * Por padrão o wrapper encolhe pro tamanho do filho (bom pra ícones e
   * botões pequenos). Ative quando o filho for algo como um card com
   * `width: 100%` — o wrapper passa a ocupar toda a largura disponível
   * em vez de encolher, permitindo que o `width: 100%` do filho funcione.
   */
  fullWidth?: boolean;
};

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const GAP = 8;

/**
 * Calcula a posição do tooltip em coordenadas de viewport (position: fixed)
 * a partir do retângulo do gatilho. Centraliza via transform, o mesmo
 * truque de antes — só que agora ancorado em pixels reais, não em % do
 * pai, porque o tooltip é renderizado fora da árvore DOM do pai.
 */
function getPortalStyle(rect: DOMRect, placement: TooltipPlacement): CSSProperties {
  switch (placement) {
    case "top":
      return {
        left: rect.left + rect.width / 2,
        top: rect.top,
        transform: `translate(-50%, calc(-100% - ${GAP}px))`,
      };
    case "bottom":
      return {
        left: rect.left + rect.width / 2,
        top: rect.bottom,
        transform: `translate(-50%, ${GAP}px)`,
      };
    case "left":
      return {
        left: rect.left,
        top: rect.top + rect.height / 2,
        transform: `translate(calc(-100% - ${GAP}px), -50%)`,
      };
    case "right":
      return {
        left: rect.right,
        top: rect.top + rect.height / 2,
        transform: `translate(${GAP}px, -50%)`,
      };
  }
}

// Variáveis do token.css que o conteúdo do tooltip pode precisar. O portal
// é renderizado em document.body, fora do elemento com a classe `.root`
// que declara essas custom properties — sem isso, var(--wc-...) não
// resolveria pra nada lá fora. Lemos o valor computado (herdado) do
// próprio gatilho, que está dentro de `.root`, e redeclaramos no elemento
// do portal. Isso também captura corretamente o --wc-accent quando ele é
// sobrescrito por instância (por card, por exemplo).
const TOKEN_VARS = [
  // Surfaces & Borders
  "--wc-ink",
  "--wc-surface",
  "--wc-surface-raised",
  "--wc-hairline",

  // Typography
  "--wc-text",
  "--wc-text-muted",
  "--wc-text-faint",

  // Fonts
  "--wc-font-clock",
  "--wc-font-display",
  "--wc-font-body",

  // Font Sizes
  "--wc-text-3xs",
  "--wc-text-2xs",
  "--wc-text-xs",
  "--wc-text-sm",
  "--wc-text-md",
  "--wc-text-lg",
  "--wc-text-xl",
  "--wc-text-2xl",
  "--wc-text-3xl",
  "--wc-text-4xl",
  "--wc-text-5xl",

  // Spacing
  "--wc-space-2xs",
  "--wc-space-xs",
  "--wc-space-sm",
  "--wc-space-md",
  "--wc-space-lg",
  "--wc-space-xl",
  "--wc-space-2xl",

  // Border Radius
  "--wc-radius-xs",
  "--wc-radius-sm",
  "--wc-radius-md",
  "--wc-radius-lg",
  "--wc-radius-xl",
  "--wc-radius-full",

  // Dynamic Accent & Shadows
  "--wc-accent",
  "--wc-accent-muted",
  "--wc-highlight",

  // Shadows
  "--wc-shadow-sm",
  "--wc-shadow-md",
  "--wc-shadow-lg",

  // Semantic Status Colors
  "--wc-success",
  "--wc-warning",
  "--wc-danger",
  "--wc-info",
] as const;

function getTokenStyle(element: HTMLElement): CSSProperties {
  const computed = window.getComputedStyle(element);
  const style: Record<string, string> = {};

  for (const token of TOKEN_VARS) {
    const value = computed.getPropertyValue(token).trim();
    if (value) style[token] = value;
  }

  return style as CSSProperties;
}

/**
 * Tooltip acessível e pensado para toque: no mobile, o tap abre e o
 * tooltip só fecha ao tocar fora, pressionar Escape ou perder o foco.
 * O hover (mouseenter/mouseleave) só é ligado em dispositivos que
 * realmente têm mouse — testado via matchMedia — porque no iOS Safari
 * o toque dispara eventos de mouse "fantasma" antes do click, e ter
 * hover + click no mesmo elemento faz o tooltip abrir e fechar sozinho
 * no mesmo tap.
 *
 * O conteúdo do tooltip é renderizado num portal para `document.body`,
 * posicionado via `getBoundingClientRect()` do gatilho. Isso evita o
 * clássico problema de `overflow: hidden`/contexto de empilhamento de
 * algum ancestral cortando ou escondendo o tooltip mesmo com z-index alto
 * — como o portal sai da árvore DOM do pai, não existe mais ancestral pra
 * cortar o conteúdo.
 */
export function Tooltip({
  content,
  children,
  placement = "top",
  disabled = false,
  fullWidth = false,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [wrapperElement, setWrapperElement] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoverCapable(query.matches);

    const handleChange = (event: MediaQueryListEvent) => setHoverCapable(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // Mede a posição do gatilho na tela quando o tooltip abre, e recalcula
  // em scroll (capture: true pega scroll de containers internos também,
  // não só da janela) e resize.
  useLayoutEffect(() => {
    if (!open || !wrapperRef.current) return;

    function updateRect() {
      if (wrapperRef.current) setRect(wrapperRef.current.getBoundingClientRect());
    }

    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (disabled) {
    return <>{children}</>;
  }

  const hoverHandlers = hoverCapable
    ? { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) }
    : {};

  return (
    <span
      ref={(element) => {
        wrapperRef.current = element;
        setWrapperElement(element);
      }}
      className={cx(styles.wrapper, fullWidth && styles.wrapperFullWidth)}
      onClick={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...hoverHandlers}
    >
      <span
        aria-describedby={open ? tooltipId : undefined}
        className={cx(styles.trigger, fullWidth && styles.triggerFullWidth)}
      >
        {children}
      </span>

      {open &&
        rect &&
        wrapperElement &&
        createPortal(
          <span
            id={tooltipId}
            role="tooltip"
            className={cx(styles.tooltip, styles[placement])}
            style={{
              position: "fixed",
              ...getPortalStyle(rect, placement),
              ...getTokenStyle(wrapperElement),
            }}
          >
            {content}
            <span className={styles.arrow} />
          </span>,
          document.body
        )}
    </span>
  );
}