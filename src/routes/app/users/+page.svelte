<script lang="ts">
	import SimpleTable from '$lib/components/SimpleTable.svelte';
	export let data;
</script>

<div class="wrap">
	<h2>Users</h2>

	<SimpleTable
		config={[
			data.users,
			[
				{
					fieldName: 'Email',
					internalName: 'email',
					fieldData: (user) => user.email,
					allowSorting: true,
					eventListeners: {
						onClick: (e, record) => {
							console.log(record);
						}
					}
				},
				{
					fieldName: 'First Name',
					internalName: 'firstName',
					fieldData: (user) => user.firstName,
					allowSorting: true
				},
				{
					fieldName: 'Last Name',
					internalName: 'lastName',
					fieldData: (user) => user.lastName,
					allowSorting: true
				},
				{
					fieldName: 'Group',
					internalName: 'group',
					fieldData: (user) => user.permissionGroup?.name,
					allowSorting: true
				}
			],
			{
				totalRecords: data.userCount
			}
		]}
	/>
</div>

<style lang="scss">
	.wrap {
		padding: 1rem;
		height: 100%;
		width: 100%;
		overflow: auto;
	}
</style>
