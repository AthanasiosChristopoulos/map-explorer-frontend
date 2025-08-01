import en from '../assets/icons/languages/en.svg';
import es from '../assets/icons/languages/es.svg';
import fr from '../assets/icons/languages/fr.svg';
import gr from '../assets/icons/languages/gr.svg';
import it from '../assets/icons/languages/it.svg';
import pt from '../assets/icons/languages/pt.svg';
import de from '../assets/icons/languages/de.svg';

const languageMap = {it, en, pt, es, fr, de, gr,};

export function matchCategoryColors(category_name) {
  switch (category_name) {
    case "History":
      return { backgroundColor: '#F2AF29', textColor: '#ffffff' };
    case "Gastronomy":
      return { backgroundColor: '#AD343E', textColor: '#ffffff' };
    case "Nature":
      return { backgroundColor: '#5296A5', textColor: '#ffffff' };
    case "Museum":
      return { backgroundColor: '#FB902D', textColor: '#ffffff' };
    case "Adventure":
      return { backgroundColor: '#2EA7CE', textColor: '#ffffff' };
    case "Art":
      return { backgroundColor: '#EAA2A8', textColor: '#ffffff' };
    default:
      return { backgroundColor: '#484C70', textColor: '#ffffff' };
  }
}

export function matchLanguageIcon(language) {
  return languageMap[language] || gr;
}

