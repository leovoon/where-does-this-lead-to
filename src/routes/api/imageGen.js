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
	// Generate the full URL out of the given path (GET parameter)
	await page.goto(url, {
		timeout: 15 * 1000
	});

	// Generate image
	const data = await page.screenshot({
		type: 'webp'
	});

	const img = data.toString('base64');
	await browser.close();
	// Set the s-maxage property which caches the images then on the Vercel edge
	return {
		body: img,
		// allow headers to be set

		headers: {
			's-maxage': '3600',
			'cache-control': 'public, max-age=3600',
			'content-type': 'image/webp'
		}
	};
};
