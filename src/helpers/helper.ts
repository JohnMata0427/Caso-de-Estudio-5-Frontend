export type Params = 'conferencistas' | 'auditorios' | 'reservas';

export const singularize = (word: string) => word.slice(0, -1);

export const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

export const separateAndCapitalize = (word: string) =>
    word
        .split('_')
        .map((word) => capitalize(word))
        .join(' ');
