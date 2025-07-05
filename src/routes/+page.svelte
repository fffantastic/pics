<script lang="ts">
	import "$lib/component/styles/style.css";

	import list from "$lib/json/list.json";
	import { appStore } from "$lib/app/store.svelte";

	import Search from "$lib/component/components/common/form/Search.svelte";
	import TagFilter from "$lib/component/components/common/filters/TagFilter.svelte";
	import Masonry from "$lib/component/components/gallery/Masonry.svelte";
</script>

<svelte:head>
	<title>Home</title>
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
		{#if artworks.length > 0}
			<Masonry 
				path="/img/thum/"
				{artworks}
			/>
		{:else}
			<p>대학이나 사물을 검색하여 이미지를 찾아보세요.</p>
		{/if}
	{:catch error}
		<p style="color: red;">이미지를 불러오는데 실패했습니다: {error.message}</p>
	{/await}
</section>
</main>


<style>
	main {
		padding: 0.8rem;
		gap: 0.5rem;
		margin:auto;
		max-width: 90rem;
	}
	.search {
		flex: 1;
		transition: flex 0.3s ease;
		background-color: var(--color-overlay-dark_005);
		max-width: 80%;
	}

	.search:focus-within {
		flex: 7;
	}

	.search:focus-within ~ .search {
		flex: 3;
	}
</style>
