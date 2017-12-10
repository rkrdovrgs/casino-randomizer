export class NumberValueConverter {
  fromView(value: string) {
    if (!!value && value.indexOf(".")) {
      return parseFloat(value);
    }
    return parseInt(value, 10);
  }
}

