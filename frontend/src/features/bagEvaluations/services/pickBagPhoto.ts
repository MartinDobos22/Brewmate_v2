import * as ImagePicker from 'expo-image-picker';

import { BAG_PHOTO_MEDIA_TYPES, BAG_PHOTO_QUALITY } from '../constants/bagPhoto';

const FIRST_ASSET = 0;

/** Where the photograph came from. Both end in the same place. */
export const BAG_PHOTO_SOURCES = {
  camera: 'camera',
  library: 'library',
} as const;

export type BagPhotoSource = (typeof BAG_PHOTO_SOURCES)[keyof typeof BAG_PHOTO_SOURCES];

const OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: [...BAG_PHOTO_MEDIA_TYPES],
  quality: BAG_PHOTO_QUALITY,
  allowsMultipleSelection: false,
};

/**
 * Takes or chooses one photograph of a bag.
 *
 * @returns the local file URI, or null when the person backed out or refused
 * the permission. Both are ordinary answers rather than errors: somebody who
 * changes their mind at the camera should land back on the form, not on a
 * message telling them something went wrong.
 */
export const pickBagPhoto = async (source: BagPhotoSource): Promise<string | null> => {
  const permission =
    source === BAG_PHOTO_SOURCES.camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  const result =
    source === BAG_PHOTO_SOURCES.camera
      ? await ImagePicker.launchCameraAsync(OPTIONS)
      : await ImagePicker.launchImageLibraryAsync(OPTIONS);

  return result.canceled ? null : (result.assets[FIRST_ASSET]?.uri ?? null);
};
