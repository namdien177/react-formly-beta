export function extractValueFromElement<
  T,
  P extends keyof T,
  E extends Element
>(element: E, parser?: (v: unknown) => T[P]): T[P] {
  const type = element.attributes.getNamedItem("type")?.value;
  let value: unknown;
  debugger;
  switch (type) {
    case "checkbox":
    case "radio":
      value = (element as unknown as HTMLInputElement).checked;
      break;
    default:
      value = (element as unknown as HTMLInputElement).value;
  }
  return parser ? parser(value) : (value as T[P]);
}
