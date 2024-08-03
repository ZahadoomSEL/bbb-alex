import { getFormattedPrice, getProductWithId } from '../helpers';

import BasketItem from './BasketItem';
import { useBasketDispatchContext } from './ImmerShop.jsx';

export default function BasketDisplay({ basket }) {
	const basketDispatch = useBasketDispatchContext();
	const basketIsEmpty = basket.length === 0;

	const totalPrice = basket.reduce((total, item) => {
		const product = getProductWithId(item.id);
		if (!product) {
			return total;
		}

		return total + product.price * item.amount;
	}, 0);

	return (
		<section className="basket">
			<h2 className="basket__heading">Warenkorb</h2>
			{basketIsEmpty && <strong>Warenkorb ist leer</strong>}
			{basketIsEmpty || (
				<>
					<ul className="basket__list">
						{basket.map((item) => (
							<BasketItem {...item} key={item.id} />
						))}
					</ul>
					<button onClick={() => basketDispatch({ action: 'emptyBasket' })}>
						Warenkorb leeren
					</button>
				</>
			)}

			{!basketIsEmpty && (
				<output className="basket__total">
					{/* Hier den Gesamtpreis anzeigen. Wenn der Warenkob leer ist,
            	soll das output-Element ausgeblendet werden. */}
					{getFormattedPrice(totalPrice)}
				</output>
			)}
		</section>
	);
}
