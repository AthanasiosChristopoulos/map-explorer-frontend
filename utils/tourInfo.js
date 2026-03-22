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
import archeology from '@/assets/icons/categories/archeology.svg';
import architecture from '@/assets/icons/categories/architecture.svg';
import art from '@/assets/icons/categories/art.svg';
import fun from '@/assets/icons/categories/fun.svg';
import kids from '@/assets/icons/categories/kids.svg';
import nature from '@/assets/icons/categories/nature.svg';
import history from '@/assets/icons/categories/history.svg';

import Bugsnag from '@bugsnag/js';

export const availableLanguages = ["it", "en", "pt", "es", "fr", "de", "gr"];

export const availableCategories = ["History", "Nature", "Architecture", "Kids", "Archeology", "Fun", "Art", "Religion"]

export const availableCountries = ["Greece", "Italy", "France", "Ireland", "Spain", "Portugal", "Belgium", "Morocco", "Croatia", "Japan", "Latvia", "Switzerland"]

export function matchCategory(category_name) {
  switch (category_name) {
    case "History":
      return { backgroundColor: '#F2AF29', textColor: '#ffffff', icon: history };
    case "Gastronomy":
      return { backgroundColor: '#AD343E', textColor: '#ffffff', icon: religion };
    case "Nature":
      return { backgroundColor: '#5296A5', textColor: '#ffffff', icon: nature };
    case "Museum":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: religion };
    case "Adventure":
      return { backgroundColor: '#2EA7CE', textColor: '#ffffff', icon: religion };
    case "Art":
      return { backgroundColor: '#EAA2A8', textColor: '#ffffff', icon: art };
    case "Architecture":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: architecture };
    case "Kids":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: kids };
    case "Archeology":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: archeology };
    case "Fun":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: fun };
    case "Religion":
      return { backgroundColor: '#FB902D', textColor: '#ffffff', icon: religion };
    default:
      return { backgroundColor: '#484C70', textColor: '#ffffff', icon: religion };
  }
}

export const languageLabelMap = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  gr: 'Greek',
  it: 'Italian',
  pt: 'Portuguese',
  de: 'German',
};

const languageIconMap = {it, en, pt, es, fr, de, gr,};

export function matchLanguageIcon(language) {
  return languageIconMap[language] || gr;
}

export function validateTour(tour) {
  const requiredFields = [
    'id',
    'title',
    'description',
    'images',
    'author',
    'categories',
    'stops',
    'stories',
    'availableLanguages',
    'coordinates'
  ];

  const missingField = requiredFields.find(field => !(field in tour));

  if (missingField) {
    Bugsnag.notify(new Error(`Tour field is missing: ${missingField}`), event => {
      event.severity = 'warning';
      event.context = 'Map';
    });
  }

  return;
}
