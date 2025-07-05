const createStore = () => {
    let selectedUnivs = $state<Set<string>>(new Set());
    let selectedItems = $state<Set<string>>(new Set());
    let noSelected = $derived(selectedUnivs.size === 0 && selectedItems.size === 0);

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

    let filteredImages = $derived.by(async () => {
        const noUniv = selectedUnivs.size === 0;
        const noItem = selectedItems.size === 0;
        if (noUniv && noItem) return [];

        const { default: comp } = await import('$lib/json/comp.json');
        const { default: idea } = await import('$lib/json/idea.json');
        const { default: items } = await import('$lib/json/items.json');

        const allComp = noUniv ? Object.values(comp).flat() : matchKeys(selectedUnivs, comp);
        const allIdea = noUniv ? Object.values(idea).flat() : matchKeys(selectedUnivs, idea);
        
        const compFiltered = allComp.filter(matchesSelectedItems);
        const ideaFiltered = allIdea.filter(matchesSelectedItems);
        const matchedItems = matchKeys(selectedItems, items);

        return [
          ...compFiltered,
          ...ideaFiltered,
          ...matchedItems
        ];
    });

    return {
        get noSelected() {
            return noSelected;
        },
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