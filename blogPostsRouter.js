const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('What are we doing here?', 'We are living.', 'Lance Le', 'Dec. 5th, 2016');
BlogPosts.create('Who am I?', 'You are you, and no one else.', 'Jenea House', 'Aug. 15th, 2015');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishedDate'];
	for(let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.name, req.body.author, req.body.publishedDate);
});

router.delete('/:id,', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted Blog Post with id \`${req.params.ID}\``);
	res.status(204).end();
});

router.put('/:id', (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishedDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id (${req.params.id}) and request body id `
      		`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post \`${req.params.id}\``);
	const updatedItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishedDate: req.body.publishedDate
	});
	res.status(204).end();
})

module.exports = router;