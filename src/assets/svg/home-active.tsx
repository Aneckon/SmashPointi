import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const HomeActiveIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 15 15" fill="none" {...props}>
    <Path
      d="M7.8254 0.120372C7.63815 -0.0401239 7.36185 -0.0401239 7.1746 0.120372L0 6.27003V13.5C0 14.3284 0.671573 15 1.5 15H5.5C5.77614 15 6 14.7761 6 14.5V11.5C6 10.6716 6.67157 10 7.5 10C8.32843 10 9 10.6716 9 11.5V14.5C9 14.7761 9.22386 15 9.5 15H13.5C14.3284 15 15 14.3284 15 13.5V6.27003L7.8254 0.120372Z"
      fill="#21706A"
    />
  </Svg>
);
