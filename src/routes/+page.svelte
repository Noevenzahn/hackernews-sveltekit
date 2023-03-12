<script lang="ts">
	import type { PageServerData } from "./$types"
	import CopyButton from "./CopyButton.svelte"
	import "./styles.css"

	export let data: PageServerData

	const getTimeAgo = (unixTimeStr: number) => {
		const unixTime = unixTimeStr * 1000
		const timeDiff = Date.now() - unixTime
		const timeAgoInMinutes = timeDiff / 1000 / 60
		const timeAgoInHours = timeAgoInMinutes / 60
		const timeAgoInDays = timeAgoInHours / 24

		if (timeAgoInMinutes < 60) return `${Math.round(timeAgoInMinutes)} minutes ago`
		else if (timeAgoInHours < 24) return `${Math.round(timeAgoInHours)} hours ago`
		else return `${Math.round(timeAgoInDays)} days ago`
	}
	const getTimeString = (time: number) => {
		return new Date(time * 1000).toString().split(" G")[0]
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
						<p class="description">
							{story.preview.description ? story.preview.description : ""}
						</p>
						<p class="info">
							<span>
								{story.data.score} points by {story.data.by}
							</span>
							<span title={getTimeString(story.data.time)}>
								{getTimeAgo(story.data.time)}
							</span>
							{#if story.data.kids}
								| {story.data.kids.length} comments
							{/if}
							<span>
								| {story.data.url.split("/")[2].replace("www.", "")}
							</span>
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
		min-width: 150px;
		width: 150px;
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
	.description {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
	@media (max-width: 600px) {
		img {
			display: none;
		}
	}
</style>
