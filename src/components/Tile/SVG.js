export default function SVG(props) {
  const { minX, minY, width, height } = props;

  return (
    <svg  aria-labelledby="title desc"
          role="img"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 100 100">
      <title id="title">{props.title}</title>
      <desc id="desc">{props.description}</desc>
      {props.children}
    </svg>
  );
}