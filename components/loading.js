import styles from '@/styles/Loading.module.css';
import Head from 'next/head';
import { AiOutlineLoading } from 'react-icons/ai';

export default function Loading() {
	return (
		<>
			<Head>
				<title>Generating ideas...</title>
			</Head>
			<section className={styles.loadingsection}>
				<span>
					<AiOutlineLoading size={50} className={styles.spinner} />
				</span>
			</section>
		</>
	);
}
