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
import { DS_CHIP_ICON } from '../../constants';
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
        <Text variant="cardTitle">{t(TRANSLATION_KEYS.dsCardTitle)}</Text>
        <Text variant="bodyText" tone="muted">
          {t(TRANSLATION_KEYS.dsCardBody)}
        </Text>
      </Card>
      <Card depth="emphasis">
        <SectionHeading
          title={t(TRANSLATION_KEYS.dsCardEmphasisTitle)}
          caption={t(TRANSLATION_KEYS.dsSectionHeadingCaption)}
          placement="card"
        />
        <ListItem
          title={t(TRANSLATION_KEYS.dsListItemTitle)}
          subtitle={t(TRANSLATION_KEYS.dsListItemSubtitle)}
          showDivider
        />
        <ListItem
          title={t(TRANSLATION_KEYS.dsListRowTitle)}
          subtitle={t(TRANSLATION_KEYS.dsListRowSubtitle)}
          icon={DS_CHIP_ICON}
        />
      </Card>
      <ChatBubble message={t(TRANSLATION_KEYS.dsChatUser)} author={CHAT_AUTHORS.user} />
      <ChatBubble message={t(TRANSLATION_KEYS.dsChatAssistant)} author={CHAT_AUTHORS.assistant} />
    </SectionBlock>
  );
};
