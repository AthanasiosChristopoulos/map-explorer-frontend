// composables/useMapAssets.js
import pin_image from '@/assets/icons/map-pin-figma.svg';
import pin_image_hover from '@/assets/icons/map-pin-figma-hover.svg';
import cluster_image_1 from '@/assets/icons/cluster/cluster-icon-3.svg';
import cluster_image_2 from '@/assets/icons/cluster/cluster-icon.svg';

function loadAndAddImage(map, id, url) {
    return new Promise((resolve) => {
        let img = new Image();
        img.onload = () => {
            map.addImage(id, img);
            resolve(true);
        };
        img.onerror = () => {
            console.log(`Failed to load image '${id}' from '${url}'. Show default config.`);
            resolve(false);
        };
        img.src = url;
    });
}

export async function useMapAssets(map) {
  const [pin, pinHover, cluster_lvl_1, cluster_lvl_2] = await Promise.all([
    loadAndAddImage(map, 'custom-pin', pin_image),
    loadAndAddImage(map, 'custom-pin-hover', pin_image_hover),
    loadAndAddImage(map, 'custom-cluster-1', cluster_image_1),
    loadAndAddImage(map, 'custom-cluster-2', cluster_image_2),
  ]);

  return { pin, pinHover, cluster_lvl_1, cluster_lvl_2 };
}

