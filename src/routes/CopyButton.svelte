<script lang="ts">
	export let story: any
	let copied = false

	const copy = (link: string) => {
		navigator.clipboard.writeText(link)
		copied = true
		setTimeout(() => (copied = false), 1000)
	}
</script>

<div class="copy-group">
	<button on:click={() => copy(story.data.url)} title="copy link">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
			/>
		</svg>
	</button>
	<p class="copy" style={copied ? "display: block" : ""}>copied!</p>
</div>

<style>
	button {
		position: absolute;
		right: 20px;
		top: 18px;
		display: grid;
		place-items: center;
		width: 25px;
		height: 25px;
		background-color: transparent;
		border: 1px solid #c4c4c4;
		border-radius: 5px;
		cursor: pointer;
		color: #c4c4c4;
		transition: all 150ms ease-in-out;
	}
	button:hover {
		background-color: #fff;
		border: #fff;
		color: #111111;
	}
	svg {
		width: 15px;
		height: 15px;
		stroke-width: 2;
	}
	.copy {
		display: none;
		position: absolute;
		right: 0;
		top: 0;
		margin: auto 10px;
		color: #fff;
		font-size: smaller;
	}
</style>
