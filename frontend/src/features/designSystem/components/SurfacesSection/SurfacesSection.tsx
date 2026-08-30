import type { JSX } from 'react';

import {
  Card,
  ChatBubble,
  ListItem,
  SectionHeading,
  Text,
  CHAT_AUTHORS,
} from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { SectionBlock } from '../SectionBlock';

export const SurfacesSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <SectionBlock title={t(TRANSLATION_KEYS.dsSectionCards)}>
      <SectionHeading
        title={t(TRANSLATION_KEYS.dsSectionHeadingTitle)}
        caption={t(TRANSLATION_KEYS.dsSectionHeadingCaption)}
      />
      <Card>
        <Text variant="titleMedium">{t(TRANSLATION_KEYS.dsCardTitle)}</Text>
        <Text variant="bodyMedium" tone="muted">
          {t(TRANSLATION_KEYS.dsCardBody)}
        </Text>
      </Card>
      <Card variant="container">
        <ListItem
          title={t(TRANSLATION_KEYS.dsListItemTitle)}
          subtitle={t(TRANSLATION_KEYS.dsListItemSubtitle)}
        />
      </Card>
      <ChatBubble message={t(TRANSLATION_KEYS.dsChatUser)} author={CHAT_AUTHORS.user} />
      <ChatBubble message={t(TRANSLATION_KEYS.dsChatAssistant)} author={CHAT_AUTHORS.assistant} />
    </SectionBlock>
  );
};
