let lastY = window.scrollY;
let header = document.getElementById("header");

let search = /^.*\/search\/?(\?.*)?$/.test(location.href);

fetch("posts.json")
	.then((response) => response.json())
	.then((data) => {
		let posts = data.posts;
		posts.forEach((post) => {
			let el = document.createElement("div");
			el.classList.add("post");

			let image = document.createElement("img");
			image.src = "./images/posts/" + post.imageName + ".png";
			el.appendChild(image);

			let title = document.createElement("h2");
			title.innerText = post.title;
			el.appendChild(title);

			if (post.tags.includes("beta")) el.classList.add("beta");

			let tags = document.createElement("div");
			post.tags.forEach((tag) => {
				let tagEl = document.createElement("span");
				tagEl.innerHTML = tag;
				if (tag === "beta") tagEl.classList.add("beta");
				tags.append(tagEl);
			});
			tags.classList.add("tag-list");
			el.append(tags);

			el.onclick = () => (location.href = post.link);
			document.getElementById("app").appendChild(el);
		});
	});

window.addEventListener("keydown", (e) => {
	if (e.key === "B") {
		document.documentElement.classList.add("show-beta");
	}
});
