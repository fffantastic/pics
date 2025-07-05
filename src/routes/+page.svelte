<script lang="ts">
	import { base } from '$app/paths';
	import "$lib/component/styles/style.css";

	import list from "$lib/json/list.json";
	import { appStore } from "$lib/app/store.svelte";

	import Search from "$lib/component/components/common/form/Search.svelte";
	import TagFilter from "$lib/component/components/common/filters/TagFilter.svelte";
	import Masonry from "$lib/component/components/gallery/Masonry.svelte";
	import Modal from "$lib/component/components/common/Modal.svelte";

	let showModal = $state(false);
	let selectedArtworkForModal = $state<{ path: string } | null>(null);

	const handleArtworkClick = (artwork: { path: string }) => {
		selectedArtworkForModal = artwork;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
		selectedArtworkForModal = null;
	};
</script>

<svelte:head>
	<title>원아트 아카이브</title>
	<meta name="원아트 아카이브" content="원아트 미술학원 입시자료 저장소" />
</svelte:head>

<main class="flex-column">
	<section class="flex-align-center">
		<div class="search">
			<Search
				items={list.univs}
				placeholder="대학"
				onSelect={appStore.toggleUniv}
				backgroundColor="var(--color-overlay-dark_005)"
			/>
		</div>
		<div class="search">
			<Search
				items={list.items}
				placeholder="사물"
				onSelect={appStore.toggleItem}
				backgroundColor="var(--color-overlay-dark_005)"
			/>
		</div>
	</section>
	<section class="flex-align-center">
		<TagFilter
			selectedTags={appStore.selectedUnivs}
			onTagToggle={appStore.toggleUniv}
		/>
		<TagFilter
			selectedTags={appStore.selectedItems}
			onTagToggle={appStore.toggleItem}
		/>
	</section>
	<section>
		{#await appStore.filteredImages}
			<p>이미지를 불러오는 중...</p>
		{:then artworks}
			{#if appStore.noSelected}
				<div class="no-image flex-center">
					<div>대학이나 사물을 검색해 이미지를 찾아보세요.</div>
					<div class="circle"></div>
				</div>
			{:else if artworks.length > 0}
				<Masonry 
				path={base + "/img/thum/"} 
				{artworks} 
				onArtworkClick={handleArtworkClick} 
			/>
			{:else}
				<div></div>
			{/if}
		{:catch error}
			<div class="no-image flex-center flex-column">
				<p>이미지를 불러오지 못했어요.</p>
				<p>인터넷 연결을 확인한 뒤, 잠시 후 다시 시도해 주세요.</p>
			</div>
		{/await}
	</section>
</main>

{#if showModal && selectedArtworkForModal}
	<Modal show={showModal} onClose={closeModal}>
		<img 
			src={base + "/img/web/" + selectedArtworkForModal.path} 
			alt="Full size artwork" 
			style="max-width: 90vw; max-height: 90vh; object-fit: contain;" />
		</Modal>
{/if}

<style>
	main {
		padding: 0.8rem;
		gap: 0.5rem;
		margin: auto;
		max-width: 90rem;
	}
	section {
		width: 100%;
	}
	.search {
		flex: 1;
		transition: flex 0.3s ease;
		background-color: var(--color-overlay-dark_005);
		width: 10rem;

	}

	.search:focus-within {
		flex: 6;
	}
	.search:focus-within ~ .search {
		flex: 4;
	}

	.no-image {
		color: var(--color-semi-accent);
		margin-top: 2rem;
		height: 100%;
		width: 100%;
	}
	.circle {
		width: 50rem;
		height: 50rem;
		border-radius: 50%;
		background-color: var(--color-secondary);
		position: fixed;
		bottom: -70%;
		left: 50%;
		transform: translate(-50%);
	}
</style>
