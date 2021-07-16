import { signIn, useSession } from 'next-auth/client';
import api from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface ButtonProps {
    priceId: string
};

export function SubscribeButton({priceId}: ButtonProps) {
    const [session] = useSession();

    async function handleSubscribe(){
        if (!session) {
            signIn('Github');
            return;
        } else {

            try {
                const response = await api.post('/subscribe');

                const { session } = response.data;

                const stripe = await getStripeJs();

                await stripe.redirectToCheckout({ sessionId: session });

            } catch (err) {
                alert(err.message)
            }
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={() => handleSubscribe()}
        >
            Subscribe now
        </button>
    )
}