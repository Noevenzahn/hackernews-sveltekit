<script lang="ts">
	import type { PageServerData } from "./$types"
	import CopyButton from "./CopyButton.svelte"
	import "./styles.css"

	export let data: PageServerData

	let copied = false

	const copy = (link: string) => {
		navigator.clipboard.writeText(link)
		copied = true
		setTimeout(() => (copied = false), 1000)
	}

	function timeAgo(unixTimeStr: number) {
		const unixTime = unixTimeStr * 1000
		const timeDiff = Date.now() - unixTime
		const timeAgoInMinutes = timeDiff / 1000 / 60
		const timeAgoInHours = timeAgoInMinutes / 60
		const timeAgoInDays = timeAgoInHours / 24

		if (timeAgoInMinutes < 60) return `${Math.round(timeAgoInMinutes)} minutes ago`
		else if (timeAgoInHours < 24) return `${Math.round(timeAgoInHours)} hours ago`
		else return `${Math.round(timeAgoInDays)} days ago`
	}
</script>

<ul>
	{#each data.storys as story, i}
		<li>
			<img src={story.preview ? story.preview.image : ""} alt="" />

			<div>
				<div>
					<a
						href={story.data.url}
						title={story.preview.title ? `original title: ${story.preview.title}` : ""}
					>
						{i + 1}.
						{story.data.title}
					</a>
					<CopyButton {story} />

					<div>
						<p>
							{story.preview.description ? story.preview.description : ""}
						</p>
						<p class="info">
							{story.data.score} points by {story.data.by}
							{timeAgo(story.data.time)}
						</p>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	a {
		display: block;
		margin-right: 30px;
		font-size: medium;
		font-weight: 600;
		color: #fff;
		text-decoration: none;
	}
	ul {
		padding: 0;
		list-style-type: none;
	}
	li {
		position: relative;
		padding: 20px 30px;
		background-color: #111111;
		border-radius: 10px;
		display: flex;
		margin-bottom: 10px;
		font-size: small;
	}
	img {
		min-width: 100px;
		width: 100px;
		height: 100%;
		margin-right: 40px;
		border-radius: 5px;
	}
	p {
		margin: 0;
		margin-top: 10px;
		color: #c4c4c4;
	}
	.info {
		font-size: smaller;
		color: #7e7e7e;
	}
	@media (max-width: 600px) {
		img {
			display: none;
		}
	}
</style>
