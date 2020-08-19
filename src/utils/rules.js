
export const ruleQtyValue = (v, max_value) => {
    if (v < 1) {
        v = 1;
    }

    const indexDot = (v + '').indexOf('.');
    if (indexDot !== -1) {
        v = v.substring(0, indexDot);
    }

    if (+v > +max_value) {
        v = max_value;
    }

    return v;
};
