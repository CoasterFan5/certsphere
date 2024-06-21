<script lang="ts">
	export let data;
	export let form;

	import ColorIcon from '~icons/ph/palette';
	import TrashIcon from '~icons/ph/trash-simple';
	import RenameIcon from '~icons/ph/cursor-text';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { invalidateAll, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import ModalForm from '$lib/components/ModalForm.svelte';
	import TextInput from '$lib/TextInput.svelte';
	import Button from '$lib/Button.svelte';
	import { toast } from 'svelte-french-toast';
	import { enhance } from '$app/forms';

	let permissionFormSubmit: HTMLButtonElement;

	const openRenameModal = () => {
		pushState('', {
			showingModal: 'editName'
		});
	};

	const openDeleteModal = () => {
		pushState('', {
			showingModal: 'deleteGroup'
		});
	};

	$: if (form) {
		if (form.success) {
			toastPromiseResolve(form.message);
		} else {
			toastPromiseReject(form.message);
			invalidateAll();
		}
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

{#if $page.state.showingModal == 'editName'}
	<Modal on:close={() => history.back()}>
		<ModalForm
			method="post"
			action="?/editName"
			title="Edit Name"
			on:submit={() => submitToastHandler('Updating')}
		>
			<TextInput label="New Name" name="name" />
			<Button value="Submit" type="submit" />
		</ModalForm>
	</Modal>
{/if}

{#if $page.state.showingModal == 'deleteGroup'}
	<Modal on:close={() => history.back()}>
		<ModalForm
			method="post"
			action="?/deleteGroup"
			title="Delete Group"
			on:submit={() => submitToastHandler('Deleting')}
		>
			<p>Are you sure you want to delete this group? This action can not be undone.</p>
			<Button value="Delete" type="submit" />
		</ModalForm>
	</Modal>
{/if}

<div class="wrap">
	<div class="title">
		<h2>{data.groupInfo.name}</h2>
		<span class="icon">
			<ColorIcon />
		</span>
		<button class="icon" on:click={openRenameModal}>
			<RenameIcon />
		</button>
		<button class="icon" on:click={openDeleteModal}>
			<TrashIcon />
		</button>
	</div>
	<form
		class="permissions"
		method="post"
		action="?/updatePermissions"
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<div class="permission">
			<ToggleSwitch
				bind:value={data.groupInfo.admin}
				label="Admin"
				name="admin"
				on:input={() => permissionFormSubmit.click()}
			/>
			<p>Admin's have all permissions regardless of how other permissions are set.</p>
		</div>
		<div class="permission">
			<ToggleSwitch
				bind:value={data.groupInfo.manageMembers}
				label="Manage Members"
				name="manageMembers"
				on:change={() => permissionFormSubmit.click()}
			/>
			<p>The ability to create, update, and delete members.</p>
		</div>
		<div class="permission">
			<ToggleSwitch
				bind:value={data.groupInfo.manageGroups}
				label="Manage Groups"
				name="manageGroups"
				on:change={() => permissionFormSubmit.click()}
			/>
			<p>The ability to create, update, and delete groups below this one.</p>
		</div>
		<div class="permission">
			<ToggleSwitch
				bind:value={data.groupInfo.manageCertifications}
				label="Manage Certifications"
				name="manageCertifications"
				on:change={() => permissionFormSubmit.click()}
			/>
			<p>The ability to create, update, and delete certifications.</p>
		</div>
		<button
			hidden
			bind:this={permissionFormSubmit}
			on:click={() => submitToastHandler('Updating Permissions')}
		/>
	</form>
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

		h2 {
			font-weight: 500;
			padding-right: 0.5rem;
		}

		span {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.3rem;
		}
	}

	.icon {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.3rem;
		padding: 0.25rem;
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 0.1);
			border-radius: 50%;
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
