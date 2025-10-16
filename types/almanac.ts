export interface AlmanacModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface PollinatorInfo {
  id: string;
  label: string;
  imageUrl: string;
  description: string;
  encountered: boolean;
}

export interface PlantInfo {
  type: string;
  label: string;
  imageUrl: string;
  description: string;
  encountered: boolean;
  timesHarvested: number;
}
