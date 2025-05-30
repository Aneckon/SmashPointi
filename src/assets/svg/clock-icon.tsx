import * as React from 'react';
import Svg, {Circle, Path, SvgProps} from 'react-native-svg';

export const ClockIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={10} stroke="#21706A" strokeWidth={2} />
    <Path
      d="M12 6v6l4 2"
      stroke="#21706A"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
