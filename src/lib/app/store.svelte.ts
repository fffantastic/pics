import comp from '$lib/json/comp.json';
import idea from '$lib/json/idea.json';
import items from '$lib/json/items.json';

const createStore = () => {
    let inputValue = $state<string>('');
    let selectedValue = $state<Set<string>>(new Set());
    let filteredImages = $state<any[]>([]);
    let isUnivKey = $state<boolean>(false);
    
    const toggleInSet = (item: string): Set<string> => {
        const newSet = new Set(selectedValue);
        newSet.has(item) ? newSet.delete(item) : newSet.add(item);
        return newSet;
    }

    const matchKeys = (json: any) => {
        return Object.entries(json).filter(([key]) =>
            selectedValue.has(key)).flatMap(([key, value]) => value);
    }

    return {
        get selectedValue() {
            return selectedValue;
        },
        get filteredImages() {
            return filteredImages;
        },

        set inputValue(value: string) {
            inputValue = value;
        },

        setSelectedValue: (value: string) => {
            selectedValue = toggleInSet(value);
        },

        setFilteredImages() {
            const matchedUnivs = matchKeys(comp);
            const matchedIdeas = matchKeys(idea);
            const matchedItems = matchKeys(items);
            
            filteredImages = [...matchedUnivs, ...matchedIdeas, ...matchedItems];
        }
    }
}

export const appStore = createStore();