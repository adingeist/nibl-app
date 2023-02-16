import { FormFile } from '@shared/types/File';
import FormData from 'form-data';
import mime from 'mime';
import { Platform } from 'react-native';

export class FormDataUtil {
  public static appendAll(
    form: FormData,
    keyValues: Record<string, string | FormFile | undefined>
  ) {
    Object.entries(keyValues).forEach(([key, value]) => {
      if (value) {
        form.append(key, value);
      }
    });
  }

  public static addAttachments(
    formData: FormData,
    field: string,
    fileUris: string[]
  ) {
    for (const uri of fileUris) {
      const trimmedURI =
        Platform.OS === 'android' ? uri : uri.replace('file://', '');

      const fileName = trimmedURI.split('/').pop();

      const directionImages = {
        name: fileName,
        type: mime.getType(trimmedURI),
        uri: trimmedURI,
      };

      formData.append(field, directionImages);
    }
  }
}
