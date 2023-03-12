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

			try {
				const html = await fetch(data.url, {
					method: "GET",
					headers: {
						"Access-Control-Allow-Origin": "*"
					}
				})
				const htmlText = await html.text()

				const $ = cheerio.load(htmlText)
				const title =
					$("title").text() ||
					$("meta[property='og:title']").attr("content") ||
					$("meta[name='twitter:title']").attr("content") ||
					$("meta[name='title']").attr("content") ||
					$("h1").text()

				const description =
					$("meta[name='description']").attr("content") ||
					$("meta[property='og:description']").attr("content") ||
					$("p").text()

				const getImageURL = (url: string) => {
					const addDomain = (urlPart: string) => {
						return url.replace(/(?<=.[a-z]{2,3}\/|#|\?).*/g, "").replace(/\/$/, "") + urlPart
					}
					const ogImage = $("meta[property='og:image']").attr("content")
					const twitterImage = $("meta[name='twitter:image']").attr("content")
					const mainImg = $("main img").attr("src")
					const img = $("img").attr("src")
					const favicon = $("link[rel='icon']").attr("href")

					const imageSrcs: (string | undefined)[] = [ogImage, twitterImage, mainImg, img, favicon]

					for (let src of imageSrcs) {
						if (!src) continue
						if (src.startsWith("https://")) return src
						if (src.startsWith("/")) return addDomain(src)
						else return addDomain("/" + src)
					}
				}
				const image = getImageURL(data.url)

				return {
					data,
					preview: {
						title,
						description,
						image
					}
				}
			} catch (err) {
				console.log(err)
				return {
					data,
					preview: {
						title: "",
						description: "",
						image: ""
					}
				}
			}
		})

		return { storys: await Promise.all(storys) }
	} catch (e) {
		console.log(e)
		return { storys: [] }
	}
}) satisfies PageServerLoad
