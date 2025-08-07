// Language Icons:
import en from '@/assets/icons/languages/en.svg';
import es from '@/assets/icons/languages/es.svg';
import fr from '@/assets/icons/languages/fr.svg';
import gr from '@/assets/icons/languages/gr.svg';
import it from '@/assets/icons/languages/it.svg';
import pt from '@/assets/icons/languages/pt.svg';
import de from '@/assets/icons/languages/de.svg';

// Category Icons:
import religion from '@/assets/icons/categories/religion.svg';


export const availableLanguages = ["it", "en", "pt", "es", "fr", "de", "gr"];

export const availableCategories = ["History", "Nature", "Architecture", "Kids", "Archeology", "Fun", "Art", "Religion"]

const languageMap = {it, en, pt, es, fr, de, gr,};

export function matchCategory(category_name) {
  switch (category_name) {
    case "History":
      return { backgroundColor: '#F2AF29', textColor: '#ffffff', icon: religion };
    case "Gastronomy":
      return { backgroundColor: '#AD343E', textColor: '#ffffff', icon: religion };
    case "Nature":
      return { backgroundColor: '#5296A5', textColor: '#ffffff', icon: religion };
    case "Museum":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: religion };
    case "Adventure":
      return { backgroundColor: '#2EA7CE', textColor: '#ffffff', icon: religion };
    case "Art":
      return { backgroundColor: '#EAA2A8', textColor: '#ffffff', icon: religion };
    case "Museum":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: religion };
    case "Museum":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: religion };
    default:
      return { backgroundColor: '#484C70', textColor: '#ffffff', icon: religion };
  }
}

export function matchLanguageIcon(language) {
  return languageMap[language] || gr;
}

