export function Snare(props: { fill?: string }) {
  return (
    <svg
      width="33px"
      height="33px"
      viewBox="0 0 443 363"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <rect id="path-1" x="0" y="0" width="456" height="100" />
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard">
          <g id="Group" transform="translate(9.000000, 50.000000)">
            <g id="Oval" transform="translate(0.000000, 216.000000)">
              <mask id="mask-2" fill="white">
                <use href="#path-1" />
              </mask>
              <g id="Mask" />
              <ellipse
                stroke={props.fill || '#000'}
                stroke-width="22"
                mask="url(#mask-2)"
                cx="213"
                cy="1.5"
                rx="207"
                ry="83.5"
              />
            </g>
            <ellipse
              id="Oval"
              stroke={props.fill || '#000'}
              stroke-width="22"
              cx="213"
              cy="89.5"
              rx="207"
              ry="83.5"
            />
            <line
              x1="420"
              y1="92"
              x2="419.5"
              y2="218.5"
              id="Line"
              stroke={props.fill || '#000'}
              stroke-width="22"
            />
            <line
              x1="326.25"
              y1="163.75"
              x2="325.75"
              y2="290.25"
              id="Line"
              stroke={props.fill || '#000'}
              stroke-width="22"
            />
            <line
              x1="110.25"
              y1="166.75"
              x2="109.75"
              y2="293.25"
              id="Line"
              stroke={props.fill || '#000'}
              stroke-width="22"
            />
            <line
              x1="6.25"
              y1="91.75"
              x2="5.75"
              y2="218.25"
              id="Line"
              stroke={props.fill || '#000'}
              stroke-width="22"
            />
          </g>
          <line
            x1="407.5"
            y1="9.5"
            x2="229.5"
            y2="132.5"
            id="Line-2"
            stroke={props.fill || '#000'}
            stroke-width="22"
            stroke-linecap="square"
          />
          <circle id="Oval" fill={props.fill || '#000'} cx="222" cy="137" r="14" />
        </g>
      </g>
    </svg>
  );
}
