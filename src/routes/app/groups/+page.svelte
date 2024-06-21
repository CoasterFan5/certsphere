<script lang="ts">
	import GroupIcon from '~icons/ph/user-circle-dashed';
	import EditIcon from '~icons/ph/pencil-simple';
	import PlusIcon from '~icons/ph/plus';
	import DragIcon from "~icons/ph/dots-six-vertical"

	import Modal from '$lib/components/Modal.svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import ModalForm from '$lib/components/ModalForm.svelte';
	import TextInput from '$lib/TextInput.svelte';
	import Button from '$lib/Button.svelte';
	import toast from 'svelte-french-toast';
	import type { Mouse } from '@playwright/test';
	import { enhance } from '$app/forms';
	export let data;
	export let form;

	let changeOrderFormButton: HTMLButtonElement;
	let changeOrderIndex: HTMLInputElement;
	let changeOrderId: HTMLInputElement;

	type GroupIsh = {
		id: number,
		priority: number,
		color: string,
		name: string,
		element: HTMLDivElement | undefined
	}

	let groups: GroupIsh[] = data.groups.map((group) => {console.log("we love map"); return {
		id: group.id,
		priority: group.priority,
		color: group.color,
		name: group.name,
		element: undefined,
	}});

	export const openCreateModal = () => {
		pushState('', {
			showingModal: 'createNewGroup'
		});
	};

	$: if (form) {
		if (form.success) {
			toastPromiseResolve(form.message);
		} else {
			toastPromiseReject(form.message);
		}
	}

	$: if ($page.url.searchParams.get('toastTinker') == 'true') {
		console.log('Toast Tinker Active');
		toast.dismiss();
	}

	let toastPromiseResolve: (message: string) => void, toastPromiseReject: (reason: string) => void;
	let toastPromise: Promise<string> = new Promise((resolve, reject) => {
		toastPromiseResolve = resolve;
		toastPromiseReject = reject;
	});

	const submitToastHandler = (loadingMessage: string) => {
		toastPromise = new Promise((resolve, reject) => {
			toastPromiseResolve = resolve;
			toastPromiseReject = reject;
		});
		toast.promise(toastPromise, {
			loading: loadingMessage,
			success: (message) => `${message}` || 'success',
			error: (message) => `${message}` || 'error'
		});
	};

	let dragging = false;
	let dragElement: HTMLDivElement;
	let dragElementIndex: number;
	let dragElementOriginalY = 0;
	let ghostIndex = Infinity;

	const startDrag = (element: HTMLDivElement | undefined, index: number) => {
		if(!element) {
			console.log("no element")
			return
		}
		dragElementIndex = index;
		dragging = true;
		dragElementOriginalY = element.getBoundingClientRect().y;
		dragElement = element;
		console.log("Drag Started")
	}

	const dragHelper = (e: MouseEvent) => {
		if(dragging) {
			let width = dragElement.clientWidth;
			dragElement.style.position = "fixed"
			dragElement.style.width = width + "px";
			dragElement.style.top = (e.clientY - dragElement.clientHeight/2) + "px";
			let newY = dragElement.getBoundingClientRect().y;
			let boxesMoved = (newY - dragElementOriginalY)/dragElement.clientHeight;
			const boxesMovedRounded = Math.floor(boxesMoved)
			const finalBoxesMoved = boxesMovedRounded < 0 ? boxesMovedRounded + 1 : boxesMovedRounded - 1;
			ghostIndex = dragElementIndex + finalBoxesMoved;

		}
	}

	const stopDrag = (e: MouseEvent) => {
		if(dragging) {
			let newY = dragElement.getBoundingClientRect().y;
			let boxesMoved = (newY - dragElementOriginalY)/dragElement.clientHeight;
			const boxesMovedRounded = Math.floor(boxesMoved)
			const finalBoxesMoved = boxesMovedRounded < 0 ? boxesMovedRounded + 1 : boxesMovedRounded - 1;
			groups.splice(dragElementIndex + finalBoxesMoved, 0, groups.splice(dragElementIndex, 1)[0])

			changeOrderIndex.value = (dragElementIndex + finalBoxesMoved).toString();
			changeOrderId.value= groups[dragElementIndex + finalBoxesMoved].id.toString()

			groups = [...groups]
			dragging = false;
			dragElement.style.position = "unset"
			dragElement.style.top = "unset"
			ghostIndex = Infinity;

			submitToastHandler("Updating order")
			changeOrderFormButton.click()
		}
	}


</script>

<svelte:window on:mousemove={dragHelper} on:mouseup={stopDrag}/>

{#if $page.state.showingModal == 'createNewGroup'}
	<Modal on:close={() => history.back()}>
		<ModalForm
			method="post"
			action="?/createGroup"
			title="Create Group"
			on:submit={() => submitToastHandler('Creating group')}
		>
			<TextInput label="Group Name" name="name" />
			<Button value="Create" />
		</ModalForm>
	</Modal>
{/if}

<form method="post" action="?/changePosition" hidden use:enhance>
	<input bind:this={changeOrderId} type="number" name="itemId"/>
	<input bind:this={changeOrderIndex} type="number" name="newItemIndex"/>
	<button bind:this={changeOrderFormButton} type="submit"/>
</form>

<div class="wrap">
	<div class="toolbar">
		<h2>Groups</h2>
		<button on:click={openCreateModal}>
			<PlusIcon />
		</button>
	</div>
	{#each groups as group, i}
		{#if i == ghostIndex && dragging && i != 0} 
			<div class="group ghost">
				<div class="infoGroupLeft">
					<span class="icon" style="color: #{group.color}">
						<GroupIcon />
					</span>
					<span class="groupName">
						Ghost
					</span>
				</div>
				<div class="edit">
					<button disabled={group.priority == 1} class="b" draggable={true} on:mousedown={() => startDrag(group.element, i)}>
						<DragIcon/>
					</button>
					<a class="b" href="/app/groups/{group.id}">
						<EditIcon />
					</a>
				</div>
			</div>
		{/if}
		<div class="group" bind:this={group.element}>
			<div class="infoGroupLeft">
				<span class="icon" style="color: #{group.color}">
					<GroupIcon />
				</span>
				<span class="groupName">
					{group.name}
				</span>
			</div>
			<div class="edit">
				<button disabled={group.priority == 1} class="b" draggable={true} on:mousedown={() => startDrag(group.element, i)}>
					<DragIcon/>
				</button>
				<a class="b" href="/app/groups/{group.id}">
					<EditIcon />
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
		margin-bottom: 0.5rem;
	}

	.infoGroupLeft {
		display: flex;
		flex-direction: row;
	}
	.edit {
		display: flex;
		align-items: center;
		justify-content: center;

		.b {
			all: unset;
			cursor: pointer;
			display: flex;
			color: var(--text);
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			padding: 0.25rem;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}

			&:hover {
				background: rgba(0, 0, 0, 0.2);
			}
		}
	}

	.toolbar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		h2 {
			font-weight: 500;
		}

		button {
			all: unset;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 0.5rem;
			padding: 0.25rem;
			border-radius: 50%;

			&:hover {
				background: rgba(0, 0, 0, 0.25);
			}
		}
	}
	.ghost {
		opacity: 0;
	}
</style>
