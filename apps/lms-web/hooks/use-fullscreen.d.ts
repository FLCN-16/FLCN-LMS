interface UseForceFullscreenOptions {
    onExit?: () => void;
    onEnter?: () => void;
}
declare function useForceFullscreen({ onExit, onEnter, }?: UseForceFullscreenOptions): {
    isFullscreen: boolean;
    hasExited: boolean;
    enterFullscreen: () => Promise<void>;
};
export default useForceFullscreen;
//# sourceMappingURL=use-fullscreen.d.ts.map