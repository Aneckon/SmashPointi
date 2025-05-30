import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const ArrowRightIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9 6l6 6-6 6"
      stroke="#B0BEC5"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
