export function SquareWave(props: { fill?: string }) {
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
        d="M10.252,130.5l0,115.986l122.248,0l0.002,-227.973l122.25,0l0,113.987"
        style={`fill:none;stroke:${props.fill ?? '#000'};stroke-width:30px;`}
      />
    </svg>
  );
}
