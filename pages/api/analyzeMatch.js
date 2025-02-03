// import { OpenAI } from 'openai'

// export default async function handler(req, res) {
// 	if (req.method !== 'POST') {
// 		return res.status(405).end('Method Not Allowed')
// 	}

// 	const { homeTeam, awayTeam, homeStats, awayStats } = req.body
// 	const openai = new OpenAI({
// 		apiKey: process.env.OPENAI_API_KEY,
// 	})

// 	try {
// 		const prompt = `
// Proszę o krótką ale konkretną anelize tekstową nadchodzącego meczu piłki nożnej między ${homeTeam} a ${awayTeam}.
// Statystyki gospodarzy ${homeTeam}:
// - Liczba rozegranych meczów: ${homeStats.playedTotal}
// - Łączna liczba wygranych meczów: ${homeStats.winstotal}
// - Łączna liczba wygranych meczów u siebie: ${homeStats.winshome}
// - Łączna liczba wygranych meczów na wyjeździe: ${homeStats.winsaway}
// - Łączna liczba zremisowanych meczów: ${homeStats.drawstotal}
// - Łączna liczba zremisowanych meczów u siebie: ${homeStats.drawshome}
// - Łączna liczba zremisowanych meczów na wyjeździe: ${homeStats.drawsaway}
// - Łączna liczba przegranych meczów: ${homeStats.losestotal}
// - Łączna liczba przegranych meczów u siebie: ${homeStats.loseshome}
// - Łączna liczba przegranych meczów na wyjeździe: ${homeStats.losesaway}
// - Forma: ${homeStats.form}
// - Mecze ze zdobytymi golami ponad 0.5: ${homeStats.goalsOver05}
// - Mecze ze zdobytymi golami poniżej 0.5: ${homeStats.goalsUnder05}
// - Mecze ze zdobytymi golami ponad 1.5: ${homeStats.goalsOver15}
// - Mecze ze zdobytymi golami poniżej 1.5: ${homeStats.goalsUnder15}
// - Mecze ze zdobytymi golami ponad 2.5: ${homeStats.goalsOver25}
// - Mecze ze zdobytymi golami poniżej 2.5: ${homeStats.goalsUnder25}
// - Mecze ze zdobytymi golami ponad 3.5: ${homeStats.goalsOver35}
// - Mecze ze zdobytymi golami poniżej 3.5: ${homeStats.goalsUnder35}
// - Łączna ilość zdobytych goli: ${homeStats.goalsfortotal}
// - Łączna ilość zdobytych goli u siebie: ${homeStats.goalsforhome}
// - Łączna ilość zdobytych goli na wyjeździe: ${homeStats.goalsforaway}

// - Mecze ze straconymi golami ponad 0.5: ${homeStats.goalsOver05aga}
// - Mecze ze straconymi golami poniżej 0.5: ${homeStats.goalsUnder05aga}
// - Mecze ze straconymi golami ponad 1.5: ${homeStats.goalsOver15aga}
// - Mecze ze straconymi golami poniżej 1.5: ${homeStats.goalsUnder15aga}
// - Mecze ze straconymi golami ponad 2.5: ${homeStats.goalsOver25aga}
// - Mecze ze straconymi golami poniżej 2.5: ${homeStats.goalsUnder25aga}
// - Mecze ze straconymi golami ponad 3.5: ${homeStats.goalsOver35aga}
// - Mecze ze straconymi golami poniżej 3.5: ${homeStats.goalsUnder35aga}
// - Łączna ilość straconych goli: ${homeStats.goalsagatotal}
// - Łączna ilość straconych goli u siebie: ${homeStats.goalsagahome}
// - Łączna ilość straconych goli na wyjeździe: ${homeStats.goalsagaaway}

// Statystyki gości ${awayTeam}:
// - Liczba rozegranych meczów: ${awayStats.playedTotal}
// - Łączna liczba wygranych meczów: ${awayStats.winstotal}
// - Łączna liczba wygranych meczów u siebie: ${awayStats.winshome}
// - Łączna liczba wygranych meczów na wyjeździe: ${awayStats.winsaway}
// - Łączna liczba zremisowanych meczów: ${awayStats.drawstotal}
// - Łączna liczba zremisowanych meczów u siebie: ${awayStats.drawshome}
// - Łączna liczba zremisowanych meczów na wyjeździe: ${awayStats.drawsaway}
// - Łączna liczba przegranych meczów: ${awayStats.losestotal}
// - Łączna liczba przegranych meczów u siebie: ${awayStats.loseshome}
// - Łączna liczba przegranych meczów na wyjeździe: ${awayStats.losesaway}
// - Forma: ${awayStats.form}
// - Mecze ze zdobytymi golami ponad 0.5: ${awayStats.goalsOver05}
// - Mecze ze zdobytymi golami poniżej 0.5: ${awayStats.goalsUnder05}
// - Mecze ze zdobytymi golami ponad 1.5: ${awayStats.goalsOver15}
// - Mecze ze zdobytymi golami poniżej 1.5: ${awayStats.goalsUnder15}
// - Mecze ze zdobytymi golami ponad 2.5: ${awayStats.goalsOver25}
// - Mecze ze zdobytymi golami poniżej 2.5: ${awayStats.goalsUnder25}
// - Mecze ze zdobytymi golami ponad 3.5: ${awayStats.goalsOver35}
// - Mecze ze zdobytymi golami poniżej 3.5: ${awayStats.goalsUnder35}
// - Łączna ilość zdobytych goli: ${awayStats.goalsfortotal}
// - Łączna ilość zdobytych goli u siebie: ${awayStats.goalsforhome}
// - Łączna ilość zdobytych goli na wyjeździe: ${awayStats.goalsforaway}

// - Mecze ze straconymi golami ponad 0.5: ${awayStats.goalsOver05aga}
// - Mecze ze straconymi golami poniżej 0.5: ${awayStats.goalsUnder05aga}
// - Mecze ze straconymi golami ponad 1.5: ${awayStats.goalsOver15aga}
// - Mecze ze straconymi golami poniżej 1.5: ${awayStats.goalsUnder15aga}
// - Mecze ze straconymi golami ponad 2.5: ${awayStats.goalsOver25aga}
// - Mecze ze straconymi golami poniżej 2.5: ${awayStats.goalsUnder25aga}
// - Mecze ze straconymi golami ponad 3.5: ${awayStats.goalsOver35aga}
// - Mecze ze straconymi golami poniżej 3.5: ${awayStats.goalsUnder35aga}
// - Łączna ilość straconych goli: ${awayStats.goalsagatotal}
// - Łączna ilość straconych goli u siebie: ${awayStats.goalsagahome}
// - Łączna ilość straconych goli na wyjeździe: ${awayStats.goalsagaaway}

// Proszę o szczegółową analizę na podstawie powyższych danych. Pisz tylko o analizie, nie pisz nic na początku np że na podstawie przekazanych statystyk itp tylko od razu pisz konkretną analizę i wniosek. 
// Proszę abyś na końcu zawsze podawał swoje przewidywanie na ten mecze i niech one obejmują tylko remis lub wygraną którejś ze stron czyli tak zwana podwójna szansa oraz przy niektórych jeśli jesteś w miarę pewny podawaj też przewidywanie na ilość bramek np powyżej 1.5 lub poniżej 2,5 w zależności od twojej analizy. W takim foramcie np: Roma wygra lub remis. Lub jeśli podajesz też bramki to np: Roma wygra lub remis i +2.5 bramki w meczu.
// `

// 		const completion = await openai.chat.completions.create({
// 			model: 'gpt-4',
// 			messages: [
// 				{ role: 'system', content: 'You are a helpful assistant.' },
// 				{ role: 'user', content: prompt },
// 			],
// 		})

// 		res.status(200).json({ analysis: completion.choices[0].message.content })
// 	} catch (error) {
// 		console.error('Error generating match analysis:', error)
// 		res.status(500).json({ error: 'Failed to generate analysis.' })
// 	}
// }
