export class YupErrors {
  public static string = {
    min: (field: string) => field + ' must be more than ${min} characters',
    max: (field: string) => field + ' must be less than ${max} characters',
  };

  public static number = {
    positive: (field: string) => field + ' must be a positive number',
    integer: (field: string) => field + ' must be a whole number',
    min: (field: string) => field + ' must be equal or greater to ${min}',
    max: (field: string) => field + ' must be equal or less than ${max}',
  };

  public static required = (field: string) => field + ' is required';
}
