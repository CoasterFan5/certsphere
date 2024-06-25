<script lang="ts" generics="T extends unknown">
	import { goto } from '$app/navigation';

	import IconButton from './IconButton.svelte';

	import { page } from '$app/stores';

	import TriangleIcon from '~icons/ph/triangle';
	import TriangleIconDisabled from '~icons/ph/triangle-dashed';
	import ChevronLeft from '~icons/ph/caret-left';
	import ChevronRight from '~icons/ph/caret-right';

	export let recordsPerPageOptions: number[] = [10, 20, 50, 100];

	$: activePerPageOption = parseInt(
		$page.url.searchParams.get('perPage') || recordsPerPageOptions[0].toString() || '10'
	);
	$: activePerPageIndex = recordsPerPageOptions.indexOf(activePerPageOption) || 0;
	$: currentPage = parseInt($page.url.searchParams.get('page') || '0');
	type GridFields = {
		fieldName: string;
		internalName: string;
		fieldData: (input: T) => string | undefined;
		allowSorting?: boolean;
		eventListeners?: {
			onClick?: (e: MouseEvent, record: T) => void;
		};
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

	const setPerPage = (perPage: number) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.set('perPage', perPage.toString());
		goto(newUrl);
	};

	const basePageFunction = (amt: number) => {
		const newUrl = new URL($page.url);
		newUrl.searchParams.set('page', (currentPage + amt).toString());
		goto(newUrl);
	};

	/**
	 * A tuple
	 *
	 * @param Data list of data
	 * @param GridFields Array of fields
	 *
	 */
	export let config: [
		T[],
		GridFields,
		{
			totalRecords: number;
		}
	];

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
				<td
					class:clickable={field.eventListeners?.onClick}
					on:click={(e) => {
						if (field.eventListeners.onClick) {
							field.eventListeners?.onClick(e, dataItem);
						}
					}}>{field.fieldData(dataItem) ? field.fieldData(dataItem) : '-'}</td
				>
			{/each}
		</tr>
	{/each}
</table>
<div class="options">
	<div
		class="perPage"
		style="background-size: {100 /
			recordsPerPageOptions.length}%; background-position-x: {activePerPageIndex *
			(100 / (recordsPerPageOptions.length - 1))}%"
	>
		{#each recordsPerPageOptions as perPageOption, index}
			<button class:active={activePerPageIndex == index} on:click={() => setPerPage(perPageOption)}>
				{perPageOption}
			</button>
		{/each}
	</div>
	<div class="pages">
		<IconButton disabled={currentPage < 2} on:click={() => basePageFunction(-1)}>
			<ChevronLeft />
		</IconButton>
		<span>
			{currentPage}/{Math.ceil(config[2].totalRecords / (activePerPageOption || 1))}
		</span>
		<IconButton
			on:click={() => basePageFunction(1)}
			disabled={currentPage == Math.ceil(config[2].totalRecords / (activePerPageOption || 1))}
		>
			<ChevronRight />
		</IconButton>
	</div>
</div>

<style lang="scss">
	table {
		width: 100%;
		gap: 0px;
		border-spacing: 0;
		border-radius: 5px;
		overflow: hidden;
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

	.options {
		width: 100%;
		padding: 1rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.perPage {
			display: flex;
			border: 1px solid rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			border-right: 0px;
			overflow: hidden;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
			background-image: linear-gradient(var(--primary) 0%, var(--primary) 100%);
			background-repeat: no-repeat;

			button {
				all: unset;
				border-right: 1px solid rgba(0, 0, 0, 0.1);
				width: 1.5rem;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				padding: 0.5rem 1rem;

				&.active {
					color: var(--bgAccent);
				}
			}
		}
	}

	.clickable {
		cursor: pointer;
	}

	.pages {
		display: flex;
		flex-direction: row;
		align-items: center;

		span {
			padding: 0 1rem;
		}
	}
</style>
