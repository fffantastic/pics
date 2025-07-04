<script lang="ts">
	import '$lib/component/styles/style.css';

	import list from "$lib/json/list.json";
	import { appStore } from "$lib/app/store.svelte";

	import Search from "$lib/component/components/common/form/Search.svelte";
	import TagFilter from "$lib/component/components/common/filters/TagFilter.svelte";

	// appStore.setSelectedValue("가위");
	// appStore.setSelectedValue("한양대");
	// appStore.setFilteredImages();
	// $inspect(appStore.filteredImages);

</script>

<svelte:head>
	<title>Home</title>
	<meta name="원아트 아카이브" content="원아트 미술학원 입시자료 저장소" />
</svelte:head>

<section class="flex-column">
	<div class="search-container">
		<Search
		items={list}
		placeholder="대학 또는 사물..."
		onSelect={appStore.setSelectedValue}
		backgroundColor="var(--color-overlay-dark_005)"
	/>
	</div>	
	<TagFilter
		selectedTags={appStore.selectedValue}
		onTagToggle={appStore.setSelectedValue}
	/>
</section>

<style>
	section {
		margin: 1rem;
	}
	.search-container{
		background-color: var(--color-overlay-dark_005);
	}
</style>
