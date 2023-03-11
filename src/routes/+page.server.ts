import type { PageServerLoad } from "./$types"
import * as cheerio from "cheerio"

export const load = (async ({ fetch }) => {
	try {
		const idsUrl = `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`
		const idsRes = await fetch(idsUrl, {
			method: "GET",
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		})
		const idsArray: number[] = await idsRes.json()

		const storys = idsArray.slice(0, 20).map(async (id: number) => {
			const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
			const response = await fetch(storyUrl, {
				method: "GET",
				headers: {
					"Access-Control-Allow-Origin": "*"
				}
			})

			const data = await response.json()

			if (!data.url) {
				return {
					data,
					preview: {
						title: "",
						description: "",
						image: ""
					}
				}
			}

			const html = await fetch(data.url, {
				method: "GET",
				headers: {
					"Access-Control-Allow-Origin": "*"
				}
			})
			const htmlText = await html.text()

			const $ = cheerio.load(htmlText)
			const title = $("title").text()
			const description =
				$("meta[name='description']").attr("content") ||
				$("meta[property='og:description']").attr("content")
			const image =
				$("meta[property='og:image']").attr("content") ||
				$("meta[name='twitter:image']").attr("content")

			return {
				data,
				preview: {
					title,
					description,
					image
				}
			}
		})

		return { storys: await Promise.all(storys) }
	} catch (e) {
		console.log(e)
		return { storys: [] }
	}
}) satisfies PageServerLoad
