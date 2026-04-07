/**
 * Professional Configuration for LiveKit "Quantum Sync"
 */
export const SYNC_CONFIG = {
  VIDEO: {
    RESOLUTION: "720p",
    FACING_MODE: "user",
  },
  AUDIO: {
    ECHO_CANCELLATION: true,
    NOISE_SUPPRESSION: true,
    AUTO_GAIN_CONTROL: true,
  },
  UI: {
    GRID_LAYOUT: "adaptive", // adaptive | manual
    STAGE_RATIO: 16 / 9,
    CONTROLS_OPACITY: 0.8,
  }
};
