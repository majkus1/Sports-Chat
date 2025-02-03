import { useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Home() {
	const [expandedSport, setExpandedSport] = useState(null)
	const { t } = useTranslation('common')

	return (
		<div className='all'>
			<NavBar />
			<div className='content'>
				<h2>{t('sports')}</h2>

				<div
					className='sport-category'
					onClick={() => setExpandedSport(expandedSport !== 'pilka-nozna' ? 'pilka-nozna' : null)}>
					<div className='sport-name'>
						<Link href='/pilka-nozna/przedmeczowe'><img src='/img/football.png' className='icon-sport' />{t('footbal')}</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export async function getStaticProps({ locale }) {
	return {
	  props: {
		...(await serverSideTranslations(locale, ['common'])),
	  },
	};
  }