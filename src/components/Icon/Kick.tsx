export function Kick(props: { fill?: string }) {
  return (
    <svg
      width="33px"
      height="33px"
      viewBox="0 0 298 317"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle
          id="Oval"
          stroke={props.fill || '#000'}
          stroke-width="22"
          cx="149"
          cy="149"
          r="138"
        />
        <line
          x1="149"
          y1="161"
          x2="149"
          y2="305"
          id="Line"
          stroke={props.fill || '#000'}
          stroke-width="23"
          stroke-linecap="square"
        />
        <circle id="Oval" fill={props.fill || '#000'} cx="149.5" cy="161.5" r="38.5" />
      </g>
    </svg>
  );
}
