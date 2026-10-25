function insertionsort(array) {
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            moves.push({ indices: [j + 1, j], swap: true });
            j--;
        }
        array[j + 1] = key;
        moves.push({ indices: [j + 1, i], swap: false });
    }
    return moves;
}