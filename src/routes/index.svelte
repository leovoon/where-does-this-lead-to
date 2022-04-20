<script>
	/** @type {HTMLImageElement}
	 */
	let img;
	/**
	 * @type {any}
	 */
	let value = '';
	/**
	 * @type {Viewer}
	 */
	let viewer;

	// check if value is url
	/**
	 * @param {string | URL} string
	 */
	function isValidHttpUrl(string) {
		let url;

		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}

		return url.protocol === 'http:' || url.protocol === 'https:';
	}

	async function submitUrl() {
		if (!isValidHttpUrl(value)) alert('Please enter a valid URL');

		const res = await fetch('/api/imageGen', {
			method: 'POST',
			body: JSON.stringify({ url: value })
		});
		const data = await res.text();
		img.src = `data:image/webp;base64,${data}`;
	}

	let placeholder = 'Enter url here http://...';
</script>

<div class="wrapper">
	<h1>What does this link lead to?</h1>
	<form on:submit|preventDefault={submitUrl}>
		<input type="text" bind:value {placeholder} />
		<button type="submit">Get Screenshot</button>
	</form>

	<div id="img-container">
		<img bind:this={img} alt="screenshot result" src="https://picsum.photos/400/300" />
	</div>
</div>

<footer>Made by <a href="https://github.com/leovoon">leovoon</a></footer>

<style>
	:global(body) {
		margin: 0;
		padding: 1rem;
		font-family: sans-serif;
	}
	.wrapper {
		display: grid;
		place-items: center;
	}

	form {
		width: 80vw;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		margin-bottom: 2rem;
	}
	input {
		grid-column: span 2;
		padding-block: 1rem;
		width: calc(100% - 1.4rem);
		padding-left: 1rem;
		font-size: large;
	}
	button {
		padding-block: 1rem;
		color: white;
		background-color: lightseagreen;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		border: none;
		font-size: large;
		transition: background-color 0.2s ease-in-out;
	}

	button:hover:focus {
		background-color: darkcyan;
	}

	#img-container {
		max-width: 80vw;
	}
	img {
		width: 100%;
	}

	footer {
		text-align: center;
		margin-top: 8em;
	}
</style>
