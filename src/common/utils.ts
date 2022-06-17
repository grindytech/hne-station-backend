function getEnumValue(enumType, key: string | string[]) {
  if (Array.isArray(key)) {
    return key.map((t) => enumType[t]);
  } else {
    return enumType[key];
  }
}

export default { getEnumValue };
