const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const { app, runServer, closeServer } = require("../server");

chai.use(chaiHttp);

describe("Blog Posts", function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it("should list blog post items on GET", function() {
		return chai
			.request(app)
			.get("/blog-posts")
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a("array");
				expect(res.body.length).to.be.at.least(1);
				res.body.forEach(function(item) {
					expect(item).to.be.a("object");
					expect(item).to.include.keys("id", "title", "content", "author", "publishDate");
				});
			});
		});

	it("should add a blog post on POST", function() {
		const newPost = {
			title: "How did I get here?",
			content: "No one knows",
			author: "Kenny Smith"
		};

		const expectedKeys = ["id", "publishDate"].concat(Object.keys(newPost));

		return chai
			.request(app)
			.post("/blog-posts")
			.send(newPost)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a("Object");
				expect(res.body).to.have.keys(expectedKeys);
				expect(res.body.title).to.equal(newPost.title);
				expect(res.body.content).to.equal(newPost.content);
				expect(res.body.author).to.equal(newPost.author);
			});
 	});

 	it("should update blog posts on PUT", function() {
 		return (
 			chai
 			.request(app)
 			.get("/blog-posts")
 			.then(function(res) {
 				const updatedPost = Object.assign(res.body[0], {
 					title: "dude wheres my car",
 					content: 'wheres your car dude'
 				});
 				return chai
 					.request(app)
 					.put(`/blog-posts/${res.body[0].id}`)
 					.send(updatedPost)
 					.then(function(res) {
 						expect(res).to.have.status(204);
 					});
 			})
 		);
 	});

 	it("should delete posts on DELETE", function() {
 		return (
 			chai
 			.request(app)
 			.get("/blog-posts")
 			.then(function(res) {
 				return chai
 				.request(app)
 				.delete(`/blog-posts/${res.body[0].id}`)
 				.then(function(res) {
 					expect(res).to.have.status(204);
 				});
 			})
 		);
 	});
}); 