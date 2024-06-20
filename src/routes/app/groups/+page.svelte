<script lang="ts">
	import GroupIcon from '~icons/ph/user-circle-dashed';
	import EditIcon from '~icons/ph/pencil-simple';
	import PlusIcon from '~icons/ph/plus';

	import Modal from '$lib/components/Modal.svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import ModalForm from '$lib/components/ModalForm.svelte';
	import TextInput from '$lib/TextInput.svelte';
	import Button from '$lib/Button.svelte';
	import toast from 'svelte-french-toast';
	export let data;
	export let form;

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

		$: if($page.url.searchParams.get("toastTinker") == "true") {
			console.log("Toast Tinker Active")
			toast.dismiss()
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
</script>

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

<div class="wrap">
	<div class="toolbar">
		<h2>Groups</h2>
		<button on:click={openCreateModal}>
			<PlusIcon />
		</button>
	</div>

	{#each data.groups as group}
		<div class="group">
			<div class="infoGroupLeft">
				<span class="icon" style="color: #{group.color}">
					<GroupIcon />
				</span>
				<span class="groupName">
					{group.name}
				</span>
			</div>
			<div class="edit">
				<a href="/app/groups/{group.id}">
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
</style>
