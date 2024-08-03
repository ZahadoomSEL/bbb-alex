import { useEffect, useReducer } from 'react';
import BasketDisplay from './BasketDisplay';
import ProductsList from './ProductsList';

export default function Shop() {
	const [basket, basketDispatch] = useReducer(
		basketReducer,
		null, // Startwert für basket, wenn keine Funktion an dritter Stelle folgt
		//	getInitialBasket // Optional: Funktion, die den Startwert zurückgibt
		getInitialBasket
	);

	/* Hier den basket-Inhalt immer in localStorage im JSON-Format unter dem
	Schlüssel "basket" speichern, wenn sich basket ändert. */
	useEffect(() => {
		localStorage.setItem('basket', JSON.stringify(basket));
	}, [basket]);

	return (
		<div className="shop">
			<ProductsList basketDispatch={basketDispatch} />
			<BasketDisplay basket={basket} basketDispatch={basketDispatch} />
		</div>
	);
}

function basketReducer(basket, message) {
	console.log(message);

	/*
	basket enthält den aktuellen state. Dieser sollte nie
	direkt manipuliert werden, etwa mit basket.push(), sondern
	stattdessen sollte man aus der Reducer-Funktion einen
	veränderte Kopie des states zurückgeben. Stichwort "Immutability",
	d.h. "Mutationen" von Daten vermeiden und stattdessen
	veränderte Kopien verwenden.
	Dadurch kann z.B. React sicherer erkennen, dass der neue State
	ein neues Objekt ist, und ein erneutes Rendern auslösen. Bei
	tief verschachtelten Objekten wäre die Unterscheidung sonst
	eventuell falsch, weil React den alten und neuen State nur
	oberflächlich ("shallow") vergleicht.
	*/

	const productNotInBasket = !basket.some(({ id }) => id === message.id);

	switch (message.action) {
		case 'add':
			/* Wenn das Produkt noch nicht im Warenkorb liegt, einen neuen
        	Array mit allen bisherigen Produkten und einem Objekt für
        	das neue Produkt zurückgeben. Um zu vermeiden, dass Informationen
        	wie der Produkttitel oder der Preis mehrfach und womöglich unterschiedlich
        	gespeichert werden, soll der Warenkorb nur die minimal nötigen Information
        	enthalten, hier also id und amount. Für alle weiteren Informationen
        	ist der products-Array die "Single Source of Truth". Wenn beispielsweise
        	der Preis sich ändert, kann so vermieden werden, dass im Warenkorb
        	ein anderer (alter) Preis gespeichert ist als in products. */
			if (productNotInBasket) {
				return [...basket, { id: message.id, amount: 1 }];
			}

			return basket.map((item) => {
				/* Anstatt das gesuchte Objekt zu manipulieren, wird ein neues
            	Objekt Objekt erzeugt, das alle Werte des alten Objekts enthält
            	(Spread-Syntax ...item), danach wird der Wert von amount mit
            	dem neuen Wert überschrieben. */
				if (item.id === message.id) {
					return { ...item, amount: item.amount + 1 };
				}

				return item;
			});
		/* Mit dem Minus-Button in BasketItem verbinden. Die Anzahl des Produktes soll
im Warenkorb um 1 reduziert werden, aber nicht unter 0 gehen. Auch bei Anzahl
0 soll das Produkt nicht aus dem Warenkorb entfernt werden. */
		case 'subtract':
			return basket.map((item) => {
				if (item.id === message.id && item.amount >= 1) {
					return { ...item, amount: item.amount - 1 };
				}

				return item;
			});

		/* Mit dem x-Button in BasketItem verbinden. Das Produkt soll
        	komplett aus dem Warenkorb entfernt werden. */
		case 'remove':
			return basket.filter((item) => item.id !== message.id);

		/* Mit dem "Warenkorb leeren"-Button in BasketDisplay verbinden.
        	Der Warenkorb soll komplett geleert werden. */
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
}
