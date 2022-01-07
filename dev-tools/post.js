const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs-extra");

console.log("Create Post----");
fs.readdir("../images/posts").then((files) => {
	inquirer
		.prompt([
			{
				name: "title",
				message: "Post Title:",
				type: "input"
			},
			{
				name: "img",
				message: "Image Name:",
				type: "list",
				choices: files.map((filePath) =>
					filePath.slice(filePath.lastIndexOf("/") + 1, -4)
				)
			},
			{
				name: "link",
				message: "Link Url:",
				type: "input"
			},
			{
				name: "tags",
				message: "Post Tags:",
				type: "checkbox",
				choices: [
					"puzzle",
					"2player",
					"4player",
					"online",
					"stratergy",
					"singleplayer",
					"tool",
					"puzzleScript",
					"javaScript",
					"godot",
					"beta"
				]
			}
		])
		.then((data) => {
			console.log("Creating post...");
			let posts = require("../posts.json");
			posts.posts.unshift({
				title: data.title,
				imageName: data.img,
				link: data.link,
				tags: data.tags
			});
			fs.writeFile("../posts.json", JSON.stringify(posts)).then(() => {
				console.log(chalk.green("Post created!"));
			});
		});
});
