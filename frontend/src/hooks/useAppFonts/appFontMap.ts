import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono/400Regular';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono/500Medium';
import { IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono/600SemiBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { SchibstedGrotesk_400Regular } from '@expo-google-fonts/schibsted-grotesk/400Regular';
import { SchibstedGrotesk_500Medium } from '@expo-google-fonts/schibsted-grotesk/500Medium';
import { SchibstedGrotesk_600SemiBold } from '@expo-google-fonts/schibsted-grotesk/600SemiBold';

import { FONT_FAMILIES } from '../../theme/tokens/typography';

/**
 * Registers every font under the exact name used by the typography tokens, so
 * a token can never point at a family the app did not load.
 *
 * Imported one weight at a time: the package root re-exports every variant,
 * and importing it would ship megabytes of unused faces in the bundle.
 */
export const APP_FONT_MAP = {
  [FONT_FAMILIES.displayRegular]: SchibstedGrotesk_400Regular,
  [FONT_FAMILIES.displayMedium]: SchibstedGrotesk_500Medium,
  [FONT_FAMILIES.displaySemiBold]: SchibstedGrotesk_600SemiBold,
  [FONT_FAMILIES.bodyRegular]: Inter_400Regular,
  [FONT_FAMILIES.bodyMedium]: Inter_500Medium,
  [FONT_FAMILIES.bodySemiBold]: Inter_600SemiBold,
  [FONT_FAMILIES.numericRegular]: IBMPlexMono_400Regular,
  [FONT_FAMILIES.numericMedium]: IBMPlexMono_500Medium,
  [FONT_FAMILIES.numericSemiBold]: IBMPlexMono_600SemiBold,
};
