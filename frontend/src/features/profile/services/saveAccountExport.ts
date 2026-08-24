import type { AccountExport } from '@brewmate/shared';
import { File, Paths } from 'expo-file-system';
import { isAvailableAsync, shareAsync } from 'expo-sharing';

import { EXPORT_JSON_INDENT, EXPORT_MIME_TYPE, EXPORT_UTI } from '../constants/accountExport';

export interface SaveExportOptions {
  readonly fileName: string;
  readonly dialogTitle: string;
}

/**
 * Writes the export to a file and hands it to the system share sheet.
 *
 * The cache directory rather than documents: this is a copy on its way
 * somewhere else - a mail app, a cloud drive, a laptop - and leaving a second
 * copy of somebody's entire account sitting in app storage afterwards would be
 * keeping more of their data than they asked us to, not less.
 *
 * An existing file is deleted rather than appended to or numbered. Exporting
 * twice should give the same file twice, and a folder slowly filling with
 * `moje-data (3).json` is a mess somebody has to tidy up.
 *
 * @returns true when the sheet was opened, false where the platform has none.
 */
export const saveAccountExport = async (
  data: AccountExport,
  { fileName, dialogTitle }: SaveExportOptions,
): Promise<boolean> => {
  if (!(await isAvailableAsync())) {
    return false;
  }

  const file = new File(Paths.cache, fileName);

  if (file.exists) {
    file.delete();
  }

  file.create();
  file.write(JSON.stringify(data, null, EXPORT_JSON_INDENT));

  await shareAsync(file.uri, {
    mimeType: EXPORT_MIME_TYPE,
    dialogTitle,
    UTI: EXPORT_UTI,
  });

  return true;
};
