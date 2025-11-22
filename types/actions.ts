export interface BeeOption {
  id: string;
  label: string;
  imageUrl: string;
}

export interface ClassificationModalProps {
  visible: boolean;
  onClose: () => void;
  onClassify: (beeType: string) => void;
  anomalyId?: number | string;
  anomalyImageUrl?: string;
}
