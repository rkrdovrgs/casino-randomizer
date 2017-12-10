export class NumberValueConverter {
  fromView(value: string) {
    let r: number;
    if (!!value && value.indexOf(".")) {
      r = parseFloat(value);
    } else {
      r = parseInt(value, 10);
    }

    return !!r || r === 0 ? r : null;
  }
}

