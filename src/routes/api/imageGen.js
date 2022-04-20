import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

/** @type import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
	const body = await request.json();
	const { url } = body;
	// Start the browser with the AWS Lambda wrapper (chrome-aws-lambda)

	const browser = await puppeteer.launch(
		process.env.AWS_EXECUTION_ENV
			? {
					args: chromium.args,
					executablePath: await chromium.executablePath,
					headless: chromium.headless
			  }
			: {
					args: [],
					executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
			  }
	);
	// Create a page with the Open Graph image size best practise
	const page = await browser.newPage();

	await page.setViewport({
		width: 1280,
		height: 720,
		deviceScaleFactor: 1
	});

	try {
		await page.goto(url, {
			timeout: 15 * 1000
		});
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: 'Invalid URL',
			headers: {
				'Content-Type': 'text/plain'
			}
		};
	}
	// Generate the full URL out of the given path (GET parameter)

	// Generate image
	const data = await page.screenshot({
		type: 'png'
	});

	if (!data || typeof data === 'string') {
		return { body: null };
	}

	await browser.close();
	return {
		body: data,
		headers: {
			's-maxage': '3600',
			'cache-control': 'public, max-age=3600',
			'content-type': 'image/png'
		}
	};
};
