import {
  HiOutlineBookOpen,
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineSparkles,
} from 'react-icons/hi'

export type NavigationIconMap = Record<string, JSX.Element>

const navigationIcon: NavigationIconMap = {
  home: <HiOutlineHome />,
  vision: <HiOutlineEye />,
  explore: <HiOutlineBookOpen />,
  practice: <HiOutlineSparkles />,
  getInvolved: <HiOutlineHeart />,
}

export default navigationIcon
