import pin_image from '@/assets/icons/map-pin-figma.svg';
import pin_image_hover from '@/assets/icons/map-pin-figma-hover.svg';
import cluster_image_1 from '@/assets/icons/cluster/cluster-icon-1.svg';
import cluster_image_2 from '@/assets/icons/cluster/cluster-icon-2.svg';
import Bugsnag from '@bugsnag/js';

function loadAndAddImage(map, id, url) {
  return new Promise((resolve) => {
      let img = new Image();
      img.onload = () => {
          map.addImage(id, img);
          resolve(true);
      };
      img.onerror = () => {
          Bugsnag.notify(new Error(`Failed to load image '${id}' from '${url}'`), event => {event.severity = 'warning'; });
          resolve(false);
      };
      img.src = url;
  });
}

export async function useMapAssets(map) {
  try {
    const [pin, pinHover, cluster_lvl_1, cluster_lvl_2] = await Promise.all([
      loadAndAddImage(map, 'custom-pin', pin_image),
      loadAndAddImage(map, 'custom-pin-hover', pin_image_hover),
      loadAndAddImage(map, 'custom-cluster-1', cluster_image_1),
      loadAndAddImage(map, 'custom-cluster-2', cluster_image_2),
    ]);
    return { pin, pinHover, cluster_lvl_1, cluster_lvl_2 };

  } catch (err) {
    Bugsnag.notify(new Error(err.message), event => {
      event.severity='warning';
      event.context = 'useMapAssets'; 
    });
  }
}

