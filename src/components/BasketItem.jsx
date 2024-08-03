import { getFormattedPrice, getProductWithId } from '../helpers';
import { useBasketDispatchContext } from './ImmerShop.jsx';

export default function BasketItem({ id, amount }) {
	const basketDispatch = useBasketDispatchContext();
	const product = getProductWithId(id);

	if (!product) {
		return null;
	}

	const { title, price } = product;

	return (
		<li className="basket-item">
			<span className="basket-item__amount">{amount} &times; </span>
			<span className="basket-item__title">{title}: </span>
			<span className="basket-item__price">
				{/* Hier den Gesamtpreis für das Produkt anzeigen, also z.B. den
    	Preis für 5 Tomaten, wenn 5 Stück im Warenkorb liegen. */}
				{getFormattedPrice(price * amount)}
			</span>
			<div className="basket-item__buttons">
				{/* Der Minus-Button soll disabled sein, wenn die Anzahl 0 ist. */}
				<button
					className="basket-item__button"
					aria-label={`${title} minus eins`}
					onClick={() => basketDispatch({ id, action: 'subtract' })}
					disabled={amount === 0}
				>
					-
				</button>
				<button
					className="basket-item__button"
					aria-label={`${title} plus eins`}
					onClick={() => basketDispatch({ id, action: 'add' })}
				>
					+
				</button>
				<button
					className="basket-item__button"
					aria-label={`${title} aus Warenkorb löschen`}
					onClick={() => basketDispatch({ id, action: 'remove' })}
				>
					&times;
				</button>
			</div>
		</li>
	);
}
