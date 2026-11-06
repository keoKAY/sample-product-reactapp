import { useState } from 'react'
import './Card.css'

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const formatPrice = (price) => {
    const value = Number(price)
    return Number.isFinite(value) ? priceFormatter.format(value) : price
}

const Card = ({ title, description, image, price }) => {
    const [imageFailed, setImageFailed] = useState(false)
    const showImage = image && !imageFailed

    return (
        <article className="product-card">
            <div className="product-card__media">
                {showImage ? (
                    <img
                        className="product-card__image"
                        src={image}
                        alt={title}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="product-card__placeholder" aria-hidden="true">
                        {title?.trim()?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}
                {price !== undefined && price !== '' && (
                    <span className="product-card__price">{formatPrice(price)}</span>
                )}
            </div>

            <div className="product-card__body">
                <h3 className="product-card__title" title={title}>{title}</h3>
                {description ? (
                    <p className="product-card__description">{description}</p>
                ) : (
                    <p className="product-card__description product-card__description--empty">
                        No description provided.
                    </p>
                )}
            </div>
        </article>
    )
}

export default Card
