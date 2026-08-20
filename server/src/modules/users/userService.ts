import type { UpdateUserRequest, User } from '@brewmate/shared';

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
}

const requireUser = (user: User | null): User => {
  if (user === null) {
    throw notFoundError(ERROR_MESSAGES.userNotFound);
  }

  return user;
};

export const createUserService = (repository: UserRepository): UserService => {
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
  };
};
