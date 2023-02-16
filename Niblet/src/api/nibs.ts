import FormData from 'form-data';

import { client } from '@src/api/connection';
import { ApiFunction } from '@src/types/apisauce';
import { FormDataUtil } from '@src/util/FormDataUtil';
import { IPostNib } from '@shared/types/routes/nib.controller';

const postNib: ApiFunction<IPostNib> = (req, config) => {
  const form = new FormData();

  form.append('caption', req.body.caption);
  form.append('recipeId', req.body.recipeId);

  FormDataUtil.addAttachments(form, 'video', req.attachments.video);

  config = {
    ...config,
    timeout: 60000,
    headers: {
      ContentType: 'multipart/form-data',
    },
  };

  return client.postWithAuthToken(`/api/v1/nibs`, form, config);
};

export const nibsApi = {
  postNib,
};
