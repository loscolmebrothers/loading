import * as react from 'react';

interface LoadingSlice {
    src: string;
    alt?: string;
}
interface LoadingProps {
    slices?: LoadingSlice[];
    className?: string;
    size?: number | string;
    duration?: number;
    onFinish?: () => void;
    inverted?: boolean;
}
type LoadingHandle = {
    finish: (onComplete?: () => void) => void;
};

declare const Loading: react.ForwardRefExoticComponent<LoadingProps & react.RefAttributes<LoadingHandle>>;

declare const DEFAULT_SLICES: LoadingSlice[];

export { DEFAULT_SLICES, Loading, type LoadingHandle, type LoadingProps, type LoadingSlice };
