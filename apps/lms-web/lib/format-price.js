const locale = navigator.language;
const formatPrice = (value, currencyCode) => {
    currencyCode = currencyCode ?? "INR";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
    }).format(value);
};
export default formatPrice;
