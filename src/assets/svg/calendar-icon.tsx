import Svg, {Path} from 'react-native-svg';

export const CalendarIcon = (props: any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3 8.5H21"
      stroke="#21706A"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path d="M7 4V6" stroke="#21706A" strokeWidth={2} strokeLinecap="round" />
    <Path d="M17 4V6" stroke="#21706A" strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M5 6H19C20.1046 6 21 6.89543 21 8V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6Z"
      stroke="#21706A"
      strokeWidth={2}
    />
  </Svg>
);
