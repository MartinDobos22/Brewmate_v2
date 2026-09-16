import type { Equipment, Grinder } from '@brewmate/shared';
import { useState, type JSX } from 'react';

import { DropdownTrigger, Sheet, type DropdownOption } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type Translator } from '../../../../i18n';
import { GrinderPicker } from '../../../inventory/components';
import { useGrinderInventory } from '../../../inventory/hooks';
import { equipmentDisplayName } from '../../../inventory/services';
import { GRINDER_OPTION_ICON } from '../../constants';

import { PreBrewGrinderOptions } from './PreBrewGrinderOptions';
import { GRINDER_PICKER_VIEWS, type GrinderPickerView } from './grinderPickerViews';

export interface PreBrewGrinderPickerProps {
  readonly candidates: readonly Equipment[];
  readonly chosenId: string | null;
  readonly onChoose: (equipmentId: string) => void;
}

const toChosenOption = (item: Equipment, t: Translator['t']): DropdownOption => ({
  id: item.id,
  label: equipmentDisplayName(item, t(TRANSLATION_KEYS.preBrewGrindUnnamed)),
  note: t(
    item.catalogGrinderId === null
      ? TRANSLATION_KEYS.preBrewGrindPickerWords
      : TRANSLATION_KEYS.preBrewGrindPickerNumber,
  ),
  icon: GRINDER_OPTION_ICON,
});

/**
 * Which grinder is turning this morning, asked on the card the answer changes.
 *
 * It used to draw itself only where there were two to choose between, on the
 * argument that a picker with one option is furniture on a screen somebody
 * opens with a kettle already boiling. That was right about the picker and
 * wrong about the question: the accounts it hid itself from were precisely the
 * ones that owned nothing catalogued, so the card answered them in words and
 * told them to go and write a grinder down on some other screen. Asked here
 * always, with the catalogue at the bottom of the same list, the answer that
 * turns "stredne jemné" into a number on a collar is one tap from the screen
 * that needs it.
 *
 * A grinder chosen out of the catalogue is written into the cupboard on the
 * way back and selected immediately. That is not bookkeeping: a grinder the
 * account does not own carries no link to a catalogue entry, and the link is
 * the whole difference between a word and a setting with the clicks to move it
 * by.
 */
export const PreBrewGrinderPicker = ({
  candidates,
  chosenId,
  onChoose,
}: PreBrewGrinderPickerProps): JSX.Element => {
  const { t } = useTranslation();
  const inventory = useGrinderInventory();
  const [view, setView] = useState<GrinderPickerView>(GRINDER_PICKER_VIEWS.closed);
  const chosen = candidates.find((item: Equipment): boolean => item.id === chosenId);

  const isBrowsing = view === GRINDER_PICKER_VIEWS.catalogue;

  const close = (): void => {
    setView(GRINDER_PICKER_VIEWS.closed);
  };

  return (
    <>
      <DropdownTrigger
        label={t(TRANSLATION_KEYS.preBrewGrindPickerHint)}
        placeholder={t(TRANSLATION_KEYS.preBrewGrindPickerEmpty)}
        chosen={chosen === undefined ? undefined : toChosenOption(chosen, t)}
        disabled={inventory.isPending}
        onPress={(): void => {
          setView(GRINDER_PICKER_VIEWS.owned);
        }}
      />
      <Sheet
        visible={view !== GRINDER_PICKER_VIEWS.closed}
        title={t(
          isBrowsing
            ? TRANSLATION_KEYS.preBrewGrindPickerCatalogueTitle
            : TRANSLATION_KEYS.preBrewGrindPickerTitle,
        )}
        closeLabel={t(TRANSLATION_KEYS.actionClose)}
        fill={isBrowsing}
        onClose={close}
      >
        {isBrowsing ? (
          <GrinderPicker
            onSelect={(grinder: Grinder): void => {
              close();
              inventory.add(grinder, (equipment: Equipment): void => {
                onChoose(equipment.id);
              });
            }}
          />
        ) : (
          <PreBrewGrinderOptions
            candidates={candidates}
            chosenId={chosenId}
            onChoose={(equipmentId: string): void => {
              close();
              onChoose(equipmentId);
            }}
            onBrowseCatalogue={(): void => {
              setView(GRINDER_PICKER_VIEWS.catalogue);
            }}
          />
        )}
      </Sheet>
    </>
  );
};
