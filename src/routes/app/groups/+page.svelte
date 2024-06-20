<script lang="ts">
	import GroupIcon from "~icons/ph/user-circle-dashed"
	import EditIcon from "~icons/ph/pencil-simple"

	export let data;
</script>


<div class="wrap">
	{#each data.groups as group}
		<div class="group">
			<div class="infoGroupLeft">
				<span class="icon" style="color: #{group.color}">
					<GroupIcon/>
				</span>
				<span class="groupName">
					{group.name}
				</span>
			</div>
			<div class="edit">
				<a href="/app/groups/{group.id}">
					<EditIcon/>
				</a>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		padding: 1rem;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0.5rem;
	}

	.group {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bgAccent);
		padding: 0.5rem;
		border-radius: 5px;
		font-size: 1.2rem;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.075);
	}

	.infoGroupLeft {
		display: flex;
		flex-direction: row;
	}
	.edit {
		display: flex;
		align-items: center;
		justify-content: center;

		a {
			display: flex;
			color: var(--text);
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			padding: 0.25rem;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			&:hover {
				background: rgba(0, 0, 0, 0.2);
			}
		}
	}
</style>

