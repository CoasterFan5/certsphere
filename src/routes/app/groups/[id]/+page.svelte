<script lang="ts">
	export let data;
	import ColorIcon from "~icons/ph/palette"
	import TrashIcon from "~icons/ph/trash-simple"
	import RenameIcon from "~icons/ph/cursor-text"
	import ToggleSwitch from "$lib/components/ToggleSwitch.svelte";
</script>

<div class="wrap">
	<div class="title">
		<h2>{data.groupInfo.name}</h2>
		<span class="icon">
			<ColorIcon/>
		</span>
		<span class="icon">
			<RenameIcon/>
		</span>
		<span class="icon">
			<TrashIcon/>
		</span>
	</div>
	<div class="permissions">
		<div class="permission">
			<ToggleSwitch value={false} label="Admin" name="admin"/>
			<p>Admin's have all permissions regardless of how other permissions are set.</p>
		</div>
		<div class="permission">
			<ToggleSwitch value={false} label="Manage Members" name="manageMembers"/>
			<p>The ability to create, update, and delete members.</p>
		</div>
		<div class="permission">
			<ToggleSwitch value={false} label="Manage Groups" name="manageMembers"/>
			<p>The ability to create, update, and delete groups below this one.</p>
		</div>
		<div class="permission">
			<ToggleSwitch value={false} label="Manage Certifications" name="manageMembers"/>
			<p>The ability to create, update, and delete certifications.</p>
		</div>
		
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		padding: 1rem;
	}

	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
		
		h2 {
			font-weight: 500;
		}

		span {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.3rem;
		}
	}

	.permission {
		display: flex;
		flex-direction: column;
		align-items: start;
		margin-top: 1rem;
		border-bottom: 1px solid var(--borders);
		max-width: 60ch;
	}
</style>