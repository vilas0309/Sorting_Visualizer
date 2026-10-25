function quicksort(array) {
    const moves = [];
    quicksortHelper(array, 0, array.length - 1, moves);
    return moves;
}

function quicksortHelper(array, low, high, moves) {
    if (low < high) {
        const pi = partition(array, low, high, moves);
        quicksortHelper(array, low, pi - 1, moves);
        quicksortHelper(array, pi + 1, high, moves);
    }
}

function partition(array, low, high, moves) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            moves.push({ indices: [i, j], swap: true });
        } else {
            moves.push({ indices: [i, j], swap: false });
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    moves.push({ indices: [i + 1, high], swap: true });
    return i + 1;
}