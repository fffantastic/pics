import comp from '$lib/json/comp.json';
import idea from '$lib/json/idea.json';
import items from '$lib/json/items.json';

const createStore = () => {
    let selectedUnivs = $state<Set<string>>(new Set());
    let selectedItems = $state<Set<string>>(new Set());

    const toggleInSet = (set: Set<string>, item: string): Set<string> => {
        const newSet = new Set(set);
        newSet.has(item) ? newSet.delete(item) : newSet.add(item);
        return newSet;
    }

    const matchKeys = (set: Set<string>, json: any) => {
        return Object.entries(json)
        .filter(([key]) => set.has(key))
        .flatMap(([key, value]) => value);
    }

    const matchesSelectedItems = (image: any): boolean =>
        selectedItems.size === 0 || (image.items ?? []).some((item:string) => selectedItems.has(item));

    const matchItem = (items:string[]) => {
        if(selectedItems.size === 0) return true;
        return items.some((item:string) => selectedItems.has(item));
    }

    let filteredImages = $derived.by(() => {
        const noUniv = selectedUnivs.size === 0;
        const noItem = selectedItems.size === 0;

        const allComp = noUniv ? Object.values(comp).flat() : matchKeys(selectedUnivs, comp);
        const allIdea = noUniv ? Object.values(idea).flat() : matchKeys(selectedUnivs, idea);
        
        const compFiltered = allComp.filter(matchesSelectedItems);
        const ideaFiltered = allIdea.filter(matchesSelectedItems);
        const matchedItems = matchKeys(selectedItems, items);

        if (noUniv && noItem) return [];
    
        return [
          ...compFiltered,
          ...ideaFiltered,
          ...matchedItems
        ];
    });

    return {
        get selectedUnivs() {
            return selectedUnivs;
        },
        get selectedItems() {
            return selectedItems;
        },
        get filteredImages() {
            return filteredImages;
        },

        toggleUniv: (value: string) => {
            selectedUnivs = toggleInSet(selectedUnivs, value);
        },

        toggleItem: (value: string) => {
            selectedItems = toggleInSet(selectedItems, value);
        }
    }
}

export const appStore = createStore();