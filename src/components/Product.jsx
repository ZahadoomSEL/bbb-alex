import { getFormattedPrice } from '../helpers';
import { useBasketDispatchContext } from './ImmerShop.jsx';

export default function Product({ title, image, price, sale, id }) {
	const cssClasses = `product ${sale ? 'product--sale' : ''}`;
	const basketDispatch = useBasketDispatchContext();

	return (
		<article className={cssClasses}>
			<div className="product__image">{image}</div>
			<h3 className="product__heading">{title}</h3>
			<p className="product__price">{getFormattedPrice(price)}</p>
			<button
				aria-label={`${title} kaufen`}
				onClick={() => basketDispatch({ id, action: 'add' })}
			>
				Kaufen
			</button>
		</article>
	);
}
