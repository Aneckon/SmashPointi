import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const LocationIcon = (props: SvgProps) => (
  <Svg width={18} height={19} viewBox="0 0 18 19" fill="none" {...props}>
    <Path
      d="M15.75 8.66667C15.75 12.3486 11.5312 17 9 17C6.46875 17 2.25 12.3486 2.25 8.66667C2.25 4.98477 5.27208 2 9 2C12.7279 2 15.75 4.98477 15.75 8.66667Z"
      stroke="#21706A"
    />
    <Path
      d="M11.25 8.75C11.25 9.99264 10.2426 11 9 11C7.75736 11 6.75 9.99264 6.75 8.75C6.75 7.50736 7.75736 6.5 9 6.5C10.2426 6.5 11.25 7.50736 11.25 8.75Z"
      stroke="#21706A"
    />
  </Svg>
);
