import { createContext, useContext, useEffect } from 'react';

import BasketDisplay from './BasketDisplay';
import ProductsList from './ProductsList';
import { useImmerReducer } from 'use-immer';

/* Erschaffe einen Context außerhalb der Komponente. In createContext()
kann ein Startwert eingegeben werden, das ist meist aber nicht sinnvoll
bzw. möglich. Also leer lassen oder explizit null verwenden.
Wenn man den eigenen Hook unten verwendet, muss der Kontext nicht exportiert werden. */
const BasketDispatchContext = createContext(null);

/* Eige
ner Hook, der das Ex- und Importieren des Kontextes
erspart. Gibt direkt den Wert zurück, der als value in
BasketDispatchContext.Provider gegeben wurde.  */
export function useBasketDispatchContext() {
	return useContext(BasketDispatchContext);
}

export default function Shop() {
	const [basket, basketDispatch] = useImmerReducer(
		basketReducer,
		null, // Startwert für basket, wenn keine Funktion an dritter Stelle folgt
		getInitialBasket // Optional: Funktion, die den Startwert zurückgibt
	);

	useEffect(() => {
		localStorage.setItem('basket', JSON.stringify(basket));
	}, [basket]);

	return (
		<div className="shop">
			{/*
  	Der value des Context kann in allen Komponenten genutzt werden,
  	die innerhalb der Provider-Komponente liegen, auch in tief verschachtelten.
  	*/}
			<BasketDispatchContext.Provider value={basketDispatch}>
				{/* Hier muss basketDispatch nicht zu Product durchgereicht
    	werden ("prop drilling"). */}
				<ProductsList />
				<BasketDisplay basket={basket} />
			</BasketDispatchContext.Provider>
		</div>
	);
}

function basketReducer(basket, message) {
	const productNotInBasket = !basket.some(({ id }) => id === message.id);

	switch (message.action) {
		case 'add':
			if (productNotInBasket) {
				basket.push({ id: message.id, amount: 1 });
				break;
			}

			basket.find((item) => item.id === message.id).amount++;
			break;
		case 'subtract': {
			const product = basket.find((item) => item.id === message.id);
			if (product && product.amount >= 1) {
				product.amount--;
			}
			break;
		}

		case 'remove':
			return basket.filter((item) => item.id !== message.id);

		case 'emptyBasket':
			return [];
	}

	return basket;
}

function getInitialBasket() {
	/* Prüfen, ob in localStorage ein Warenkorb gespeicher ist. Wenn ja,
	diesen zurückgeben, wenn nein, einen leeren Array zurückgeben.
	Achtung: JSON.parse wirft einen Fehler, wenn der String in basket
	nicht korrekt im JSON-Formate codiert ist, deshalb JSON.parse immer
	mit try-catch verwenden.
	*/

	try {
		const basket = JSON.parse(localStorage.getItem('basket'));

		return Array.isArray(basket) ? basket : [];
	} catch (error) {
		console.log(error);
	}

	return [];
}
