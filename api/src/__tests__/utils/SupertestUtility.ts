import { Test } from 'supertest';
import { ReadStream } from 'fs';
import _ from 'lodash';

type MultipartValueSingle =
  | Blob
  | Buffer
  | ReadStream
  | string
  | boolean
  | number;

type MultipartValue = MultipartValueSingle | MultipartValueSingle[];

export type Attachment = {
  field: string;
  file: MultipartValueSingle;
  options?:
    | string
    | {
        filename?: string | undefined;
        contentType?: string | undefined;
      }
    | undefined;
};

export type Attachments = Attachment[];

export type FieldsObject = Record<string, MultipartValue>;

/**
 * Adds attachments to a supertest request in bulk through an object containing
 * key-value pairs.
 * @param rootTest Test to add attachments to. Ex) request.post('endpoint')
 * @param rootAttachments Object of fields and attachment values to add.
 * @returns
 */
export const addAttachments = (
  rootTest: Test,
  rootAttachments: Attachments
): Test => {
  const copy = _.clone(rootAttachments);

  const addAttachmentsRecursive = (
    test: Test,
    attachments: Attachments
  ): Test => {
    const attachment = attachments.pop();
    if (!attachment) return test;
    return addAttachmentsRecursive(
      test.attach(attachment.field, attachment.file, attachment.options),
      attachments
    );
  };

  return addAttachmentsRecursive(rootTest, copy);
};

/**
 * Adds fields to a supertest request in bulk through an object containing
 * key-value pairs.
 * @param rootTest Test to add fields to. Ex) request.post('endpoint')
 * @param rootFieldsObject Object of fields and values to add.
 */
export const addFields = (
  rootTest: Test,
  rootFieldsObject: FieldsObject
): Test => {
  const copy = _.clone(rootFieldsObject);

  const addFieldsRecursive = (test: Test, fieldsObject: FieldsObject): Test => {
    if (_.size(fieldsObject) <= 0) {
      return test;
    }

    const keys = Object.keys(fieldsObject);
    const values = Object.values(fieldsObject);

    delete fieldsObject[keys[0]];
    return addFieldsRecursive(test.field(keys[0], values[0]), fieldsObject);
  };

  return addFieldsRecursive(rootTest, copy);
};
