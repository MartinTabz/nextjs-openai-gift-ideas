import { openai } from '@/utils/openai';
import { Limit } from '@/utils/rate-limit';
import { v4 as uuidv4 } from 'uuid';

const options = {
	interval: 60 * 1000, // 60 seconds
	uniqueTokenPerInterval: 100, // Max 500 users per second
};

const limiter = Limit(options);

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			await limiter.check(res, 5, 'CACHE_TOKEN'); // 5 requests per minute
			const data = req.body;
			if (!data) {
				res.status(400).json({ error: 'Body is missing' });
				return;
			}
			if (!data.gender || !data.age || !data.interests || !data.role || !data.occasion) {
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
				pronoun = 'This persons';
			}

			var occandint = `${pronoun} interests are ${intereststring}`;

			if (data.occupation !== null && data.occupation.trim() !== '' && data.occupation) {
				occandint = `${pronoun} occupation is ${data.occupation} and their interests are ${intereststring}`;
			} else {
				occandint = `${pronoun} interests are ${intereststring}`;
			}

			var occasion = ` that are appropriate for a ${data.occasion}.`;
			if(data.occasion === 'other important day') {
				occasion = ` that are appropriate for a very important day.`;
			} else if (data.occasion === 'just because') {
				occasion = ` that are appropriate as an appreciative gifts for their existence.`;
			}

			var prompt = `I will give you information about a person and your goal is to come up with 15 ideas for a gift${occasion} Every single idea should be a physical product or something that you could find on Amazon, avoid membership, vouchers and courses. Return only short keywords of the product, keywords meaning what would you type to google or amazon to find relevant products. Write the results as a JSON array, without backticks only a clean array like this: ["product1", "product2", "product3"]. I will also give you information (gender, age, occupation, interests) about the person that will receive the gift and relation between a person giving and receiving the gift. It is not necessary to list ideas by their interests and occupation just come up with something useful based on their age and gender. It should be mostly gadgets or it can be clothes, but BE really specific and not ordinary. When picking gifts you can look for connections and pick a gift that connects to those product niches. So, give me 15 ideas for ${data.age} year old ${gender}. The person giving a gift has a relationship with the person receiving the gift of: ${data.role}. ${occandint}. `;
			console.log(prompt);
			try {
				const aires = await openai.createCompletion({
					model: 'text-davinci-003',
					prompt: prompt,
					temperature: 0.5,
					max_tokens: 256,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					best_of: 2,
				});
				const suggestions = aires.data?.choices?.[0].text;
				if (suggestions === undefined) {
					res.status(500).send({ error: 'Failed to get response from OPENAI' });
				}
				res.status(200).send({ result: suggestions, id: uuidv4() });
			} catch (err) {
				res.status(500).send({ error: 'Failed to fetch data' });
			}
		} catch {
			res.status(429).json({ error: 'Rate limit exceeded' });
		}
	} else {
		res.status(405).json({ error: 'Wrong request method!' });
	}
}
