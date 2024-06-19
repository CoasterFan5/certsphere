<script lang="ts">
	import HouseIcon from "~icons/ph/house"
	import CertificateIcon from "~icons/ph/certificate"
	import UsersIcon from "~icons/ph/users"
	import UserIcon from "~icons/ph/user"
</script>

<div class="wrap">
	<nav>
		<a href="/app">
			<HouseIcon/>
			Dashboard
		</a>
		<a href="/app/certifications">
			<CertificateIcon/>
			Certifications
		</a>
		<a href="/app/certifications">
			<UsersIcon/>
			Groups
		</a>
		<a href="/app/users">
			<UserIcon/>
			Users
		</a>
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
			min-width: 12rem;
			background: var(--bgAccent);
			box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
			padding: 1rem 0.4rem;

			a {
				padding: 0.5rem 0.5rem;
				display: flex;
				align-items: start;
				justify-content: start;
				gap: 0.25rem;
				color: var(--text);
				text-decoration: none;
				border-radius: 5px;
				transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

				&:hover {
					background: var(--primary);
					color: var(--primaryText);
				}
			}
		}
	}
</style>
