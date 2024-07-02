export const keysToOmit = (kvKeys: string[]) => {
    return kvKeys
        .map((k, i) => {
            let s = `k!=${k}`;
            if (i !== kvKeys.length - 1) {
                s = `${s} AND `;
            }
            return s;
        })
        .join('');
};
