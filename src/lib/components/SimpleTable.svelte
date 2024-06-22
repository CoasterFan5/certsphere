<script lang="ts" generics="T extends unknown">
	import { goto } from '$app/navigation';

	import IconButton from './IconButton.svelte';

	import { page } from '$app/stores';

	import TriangleIcon from '~icons/ph/triangle';
	import TriangleIconDisabled from '~icons/ph/triangle-dashed';

	type GridFields = {
		fieldName: string;
		internalName: string;
		fieldData: (input: T) => string | undefined;
		allowSorting?: boolean;
	}[];

	enum SortingMode {
		ascending = 'ascending',
		descending = 'descending',
		unset = 'unset'
	}

	const setFilter = (internalName: string, sortingMode: SortingMode) => {
		console.log('setting filter');
		const newUrl = new URL($page.url);
		newUrl.searchParams.set('orderBy', internalName);
		newUrl.searchParams.set('sortingMode', sortingMode);
		goto(newUrl);
	};

	const checkFilterStatus = (internalName: string, sortingMode: SortingMode) => {
		return (
			$page.url.searchParams.get('orderBy') == internalName &&
			$page.url.searchParams.get('sortingMode') == sortingMode
		);
	};

	/**
	 * A tuple
	 *
	 * @param Data list of data
	 * @param GridFields Array of fields
	 *
	 */
	export let config: [T[], GridFields];

	const gridConfigIndex = 1;
	const dataIndex = 0;
</script>

<table>
	{#key $page.url}
		<tr>
			{#each config[gridConfigIndex] as field}
				<th>
					<div class="header">
						{field.fieldName}
						<div class="actions">
							{#if field.allowSorting}
								{#if checkFilterStatus(field.internalName, SortingMode.ascending)}
									<IconButton
										on:click={() => setFilter(field.internalName, SortingMode.descending)}
									>
										<TriangleIcon />
									</IconButton>
								{:else if checkFilterStatus(field.internalName, SortingMode.descending)}
									<IconButton on:click={() => setFilter(field.internalName, SortingMode.unset)}>
										<TriangleIcon style="transform: rotate(180deg)" />
									</IconButton>
								{:else}
									<IconButton on:click={() => setFilter(field.internalName, SortingMode.ascending)}>
										<TriangleIconDisabled />
									</IconButton>
								{/if}
							{/if}
						</div>
					</div>
				</th>
			{/each}
		</tr>
	{/key}
	{#each config[dataIndex] as dataItem, i}
		<tr class:altBg={i % 2 == 0}>
			{#each config[gridConfigIndex] as field}
				<td>{field.fieldData(dataItem) ? field.fieldData(dataItem) : '-'}</td>
			{/each}
		</tr>
	{/each}
</table>

<style lang="scss">
	table {
		width: 100%;
		gap: 0px;
		border-spacing: 0;
		border-radius: 5px;
		overflow: hidden;
		height: 100%;
	}

	.altBg {
		background: var(--bgAccent);
	}

	th {
		padding: 0.5rem;
		text-align: left;
		background: rgba(0, 0, 0, 0.1);

		.header {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	tr {
		border-bottom: 1px solid var(--borders);
	}

	td {
		padding: 0.25rem 0.5rem;
	}
</style>
