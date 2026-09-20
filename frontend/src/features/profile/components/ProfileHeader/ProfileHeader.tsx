import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { useAuthSession, useCurrentUser } from '../../../auth';
import { PROFILE_HEADER_ICONS } from '../../constants';

import { createProfileHeaderStyles } from './ProfileHeader.styles';

/**
 * Who is signed in, and the way to what they brew with.
 *
 * The address comes from the API rather than from Firebase, which is also what
 * makes the backend user visible the moment it is provisioned. Whether it has
 * been verified is a mark beside it rather than a sentence under it: it is one
 * bit about the address, not a second fact about the person.
 */
export const ProfileHeader = (): JSX.Element => {
  const styles = useThemedStyles(createProfileHeaderStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { user, needsEmailVerification } = useAuthSession();
  const { data: currentUser } = useCurrentUser();
  const email = currentUser?.email ?? user?.email ?? null;

  const cogStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.cog,
    pressed && styles.pressed,
  ];

  return (
    <View style={styles.row}>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name={PROFILE_HEADER_ICONS.account}
            size={theme.size.iconMedium}
            color={theme.colors.accentOnEspresso}
          />
        </View>
        <View style={styles.names}>
          <Text variant="displayIdentity" tone="onEspresso">
            {t(TRANSLATION_KEYS.profileHeaderTitle)}
          </Text>
          <View style={styles.email}>
            <MaterialCommunityIcons
              name={
                needsEmailVerification
                  ? PROFILE_HEADER_ICONS.unverified
                  : PROFILE_HEADER_ICONS.verified
              }
              size={theme.size.iconTiny}
              color={
                needsEmailVerification
                  ? theme.colors.onEspressoVariant
                  : theme.colors.onEspressoPositive
              }
            />
            <Text variant="caption" tone="onEspressoMuted" numberOfLines={1}>
              {email ?? t(TRANSLATION_KEYS.authAccountEmailUnknown)}
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        style={cogStyle}
        onPress={(): void => {
          router.push(ROUTES.gear);
        }}
        accessibilityRole="button"
        accessibilityLabel={t(TRANSLATION_KEYS.profileOpenGear)}
      >
        <MaterialCommunityIcons
          name={PROFILE_HEADER_ICONS.gear}
          size={theme.size.iconMedium}
          color={theme.colors.accentSoft}
        />
      </Pressable>
    </View>
  );
};
