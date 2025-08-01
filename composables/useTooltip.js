import { usePopup } from './tooltip/usePopup'
import { useMapInteractions } from './tooltip/useMapInteractions'

export function useTooltip(tours, map, findTours) {
  const { openTooltip, closeTooltip, getCurrentId, setExitAnimation } = usePopup(map, tours, findTours);
  useMapInteractions(map, openTooltip, closeTooltip, getCurrentId, setExitAnimation, findTours);

  return closeTooltip;
}

