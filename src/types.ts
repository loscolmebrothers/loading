export interface LoadingSlice {
  src: string;
  alt?: string;
}

export interface LoadingProps {
  slices?: LoadingSlice[];
  className?: string;
  duration?: number;
  onFinish?: () => void;
  inverted?: boolean;
}

export type LoadingHandle = {
  finish: (onComplete?: () => void) => void;
};
