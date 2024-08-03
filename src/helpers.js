import products from './products';

export function getFormattedPrice(price, currencySymbol = ' €') {
	const formattedPrice =
		(price / 100).toFixed(2).replace('.', ',') + currencySymbol;

	return formattedPrice;
}

export function getProductWithId(searchedId) {
	/* Hier in products nach dem Produkt suchen und das Produkt
  (statt null) zurückgeben. */
	return products.find(({ id }) => searchedId === id);
}
