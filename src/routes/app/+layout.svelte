
<div class="wrap">
	<nav>
		<a href="/app">Dashboard</a>
	</nav>
	<slot/>
</div>

<style lang="scss">
	.wrap {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;


		nav {
			height: 100%;
		}
	}
</style>
