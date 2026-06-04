export interface BilingualText {
    en: string;
    ar: string;
}

export interface BilingualOptions {
    en: string[];
    ar: string[];
}

export const ensureBilingual = (value: any): BilingualText => {
    if (!value) return { en: '', ar: '' };
    if (typeof value === 'object' && value !== null) {
        return { en: value.en || '', ar: value.ar || '' };
    }
    if (typeof value === 'string') {
        try {
            if (value.startsWith('{')) {
                const parsed = JSON.parse(value);
                return ensureBilingual(parsed);
            }
        } catch (e) {}
        return { en: value, ar: value };
    }
    return { en: '', ar: '' };
};

export const ensureBilingualOptions = (value: any): BilingualOptions => {
    if (!value) return { en: [], ar: [] };
    if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
            return { en: value, ar: value };
        }
        return { en: value.en || [], ar: value.ar || [] };
    }
    if (typeof value === 'string') {
        try {
            if (value.startsWith('{') || value.startsWith('[')) {
                const parsed = JSON.parse(value);
                return ensureBilingualOptions(parsed);
            }
        } catch (e) {}
    }
    return { en: [], ar: [] };
};
