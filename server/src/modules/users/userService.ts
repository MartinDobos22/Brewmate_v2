import type { DeleteAccountResponse, UpdateUserRequest, User } from '@brewmate/shared';

import type { IdentityDeleter } from '../../auth/identityDeleter.js';
import type { VerifiedToken } from '../../auth/verifiedToken.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';

import { toUser } from './userMapper.js';
import type { UserRepository } from './userRepository.js';

const NO_CHANGES = 0;

export interface UserService {
  /** Looks up the user behind a verified identity, creating one on first sight. */
  provisionFromIdentity(token: VerifiedToken): Promise<User>;
  getById(id: string): Promise<User>;
  updateProfile(id: string, changes: UpdateUserRequest): Promise<User>;
  /** Erases the account: the stored data first, then the Firebase identity. */
  deleteAccount(user: User): Promise<DeleteAccountResponse>;
}

const requireUser = (user: User | null): User => {
  if (user === null) {
    throw notFoundError(ERROR_MESSAGES.userNotFound);
  }

  return user;
};

export const createUserService = (
  repository: UserRepository,
  identityDeleter: IdentityDeleter,
): UserService => {
  const getById = async (id: string): Promise<User> => {
    const row = await repository.findById(id);

    return requireUser(row === null ? null : toUser(row));
  };

  return {
    getById,

    provisionFromIdentity: async (token: VerifiedToken): Promise<User> =>
      toUser(
        await repository.upsertByFirebaseUid({
          firebaseUid: token.firebaseUid,
          email: token.email,
        }),
      ),

    updateProfile: async (id: string, changes: UpdateUserRequest): Promise<User> => {
      if (Object.keys(changes).length === NO_CHANGES) {
        return getById(id);
      }

      const row = await repository.updateById(id, changes);

      return requireUser(row === null ? null : toUser(row));
    },

    /**
     * Stored data goes first: if removing the identity then fails, the request
     * fails too and a retry converges - the next call re-provisions an empty
     * row, deletes it again and retries the identity. The reverse order could
     * strand personal data behind an identity nobody can sign in as.
     *
     * Deleting an account that is already partly gone is not an error, so the
     * client can always retry.
     */
    deleteAccount: async (user: User): Promise<DeleteAccountResponse> => {
      await repository.deleteById(user.id);
      await identityDeleter.deleteUser(user.firebaseUid);

      return { deletedAt: new Date().toISOString() };
    },
  };
};
