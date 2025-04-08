const url = 'https://api-basketball.p.rapidapi.com/countries';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '93a6c5ee91mshfc5756cc0394122p17b5f3jsnfa34b39525f9',
		'x-rapidapi-host': 'api-basketball.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}