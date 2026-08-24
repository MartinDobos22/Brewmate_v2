import { API_ROUTES, accountExportSchema, type AccountExport } from '@brewmate/shared';

import { getApiClient } from '../../../lib/apiClient';

/**
 * Everything this account has stored, in one document.
 *
 * Validated against the shared schema like every other response, which here
 * does something the other calls do not: it is the app checking that the copy
 * somebody is about to keep really is the shape it claims to be, before it is
 * written to a file that will outlive this version of the app.
 */
export const fetchAccountExport = async (): Promise<AccountExport> =>
  getApiClient().request({ path: API_ROUTES.meExport, schema: accountExportSchema });
