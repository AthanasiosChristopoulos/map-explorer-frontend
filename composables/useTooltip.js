import { usePopup } from './tooltip/usePopup.js'
import { useMapInteractions } from './tooltip/useMapInteractions.js'

export function useTooltip(tours, map, findTours) {
  const { openTooltip, closeTooltip, getCurrentId, setExitAnimation } = usePopup(map, tours, findTours);
  useMapInteractions(map, openTooltip, closeTooltip, getCurrentId, setExitAnimation, findTours);

  return closeTooltip;
}

