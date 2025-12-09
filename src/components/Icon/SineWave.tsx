export function SineWave(props: { fill?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 265 265"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style={{ "fill-rule": "evenodd", "clip-rule": "evenodd", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-miterlimit": "1.5" }}
    >
      <rect id="Artboard1" x="0" y="0" width="265" height="265" style={{ "fill": "none" }} />
      <path
        d="M10.252,133.213c0,0 9.559,113.045 61.617,113.273c34.058,0.149 49.337,-54.844 60.883,-113.273c11,-55.665 36.418,-114.7 63.965,-114.7c43.537,-0 58.035,114.7 58.035,114.7"
        style={`fill:none;stroke:${props.fill ?? '#000'};stroke-width:30px;`}
      />
    </svg>
  );
}
