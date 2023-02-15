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

		// If Other gender is chosen
		var gender = data.gender;
		if (gender === 'other') {
			gender = 'male and female';
		}

		// Interest array to string
		var intereststring = '';
		for (var i = 0; i < data.interests.length; i++) {
			intereststring += data.interests[i];
			if (i < data.interests.length - 1) {
				intereststring += ', ';
			}
		}

		// Pronoun
		var pronoun = 'His';
		if (data.gender == 'male') {
			pronoun = 'His';
		} else if (data.gender == 'female') {
			pronoun = 'Her';
		} else {
			pronoun = 'Its';
		}

		var prompt = `I will give you information about a person and your goal is to come up with 15 ideas for a gift for them. Every single idea should be a physical product, not a membership or a voucher. Use only short keywords of the product - keywords meaning what would you type to google or amazon to find product of it's niche. Write the results as a JSON array. I will also give you the interests of that specific person but it is not necessary to list ideas by their interests just come up with something useful based on their age and gender. Give me 15 gift ideas for ${data.age} year old ${gender}. ${pronoun} interests are ${intereststring}.`;
		console.log(prompt);
		
		try {
			const aires = await openai.createCompletion({
				model: 'text-davinci-003',
				prompt: prompt,
				temperature: 1,
				max_tokens: 250,
				top_p: 1,
				frequency_penalty: 0.1,
				presence_penalty: 0.1,
			});
			const suggestions = aires.data?.choices?.[0].text;
			if (suggestions === undefined) {
				res.status(500).send({ error: 'Failed to get response from OPENAI' });
			}
			res.status(200).send({ result: suggestions });
		} catch (err) {
			res.status(500).send({ error: 'Failed to fetch data' });
		}
	} else {
		res.status(405).json({ error: 'Wrong request method!' });
	}
}
