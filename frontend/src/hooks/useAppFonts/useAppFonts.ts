import { useFonts } from 'expo-font';

import { APP_FONT_MAP } from './appFontMap';

/** True once every app font is available and text can render at final metrics. */
export const useAppFonts = (): boolean => {
  const [loaded, error] = useFonts(APP_FONT_MAP);

  return loaded || error !== null;
};
