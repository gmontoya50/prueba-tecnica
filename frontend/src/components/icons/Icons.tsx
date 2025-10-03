import React from 'react';
import { IDataIconProps } from './types/types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
const iconMap: { [key: string]: React.ElementType } = {
  checkCircleIcon: CheckCircleIcon,
  panoramaFishEyeIcon: PanoramaFishEyeIcon,
  deleteIcon: DeleteIcon,
  editIcon: EditIcon,
  moon: NightlightIcon,
  sun: LightModeIcon,
  addIcon: AddIcon,
  chevronDown: ExpandMoreIcon,
  chevronUp: ExpandLessIcon,
};

const DataIcon = ({ name, ...props }: IDataIconProps) => {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent fontSize="medium" {...props} /> : null;
};

export { DataIcon };
