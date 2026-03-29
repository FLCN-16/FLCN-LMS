// Typed messages for next-intl — gives autocomplete on t("key") calls
import en from "./messages/en.json"

type Messages = typeof en

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
