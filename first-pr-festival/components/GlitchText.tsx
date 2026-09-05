type Props = {
  children: string;
  className?: string;
};

/** Renders text with the CSS chromatic-tear glitch defined in globals.css. */
export default function GlitchText({ children, className = "" }: Props) {
  return (
    <span data-text={children} className={`glitch ${className}`}>
      {children}
    </span>
  );
}
