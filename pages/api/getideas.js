import { openai } from '@/utils/openai';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const data = req.body;
		if (!data) {
			res.status(400).json({ error: 'Body is missing' });
			return;
		}
		if (!data.gender || !data.age || !data.interests) {
			res.status(400).json({ error: 'Some data is missing' });
			return;
		}
		var gender = data.gender;
		if (gender === 'other') {
			gender = 'male and female';
		}
		var intereststring = '';
		for (var i = 0; i < data.interests.length; i++) {
			intereststring += data.interests[i];
			if (i < data.interests.length - 1) {
				intereststring += ', ';
			}
		}
		var prompt = `Give me 10 gift ideas for ${data.age} year old ${gender}. His interests are ${intereststring}. Every idea should be some kind of product or toy, that sells on site like Amazon.`;

		const airesponse = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: prompt,
			temperature: 1,
			max_tokens: 300,
			top_p: 1,
			frequency_penalty: 0.1,
			presence_penalty: 0.1,
		});
		console.log(airesponse.data.choices[0]);

		res.status(200).json({
			message: 'Comunication was succesfull',
		});
		return;
	} else {
		res.status(405).json({ error: 'Wrong request method!' });
	}
}
