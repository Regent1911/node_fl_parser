function getRandomArbitrarySec(min, max)
{
	return Math.round(Math.random() * (max - min) + min) * 1000;
};

module.exports = getRandomArbitrarySec;