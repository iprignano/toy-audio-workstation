export function Hihats(props: { fill?: string }) {
  return (
    <svg
      width="35px"
      height="33px"
      viewBox="0 0 443 363"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <polygon
          id="Triangle"
          stroke={props.fill || '#000'}
          stroke-width="22"
          points="221.5 16 395 113 48 113"
        ></polygon>
        <polygon
          id="Triangle"
          stroke={props.fill || '#000'}
          stroke-width="22"
          transform="translate(221.500000, 211.500000) scale(1, -1) translate(-221.500000, -211.500000) "
          points="221.5 163 395 260 48 260"
        ></polygon>
        <line
          x1="221.359375"
          y1="347.36102"
          x2="221.453125"
          y2="263.290296"
          id="Line"
          stroke={props.fill || '#000'}
          stroke-width="22"
          stroke-linecap="square"
        ></line>
      </g>
    </svg>
  );
}
