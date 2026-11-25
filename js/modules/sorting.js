/* ==========================================================================
   ArrayLab — Assignment 2: Sorting Algorithms Simulator
   Interactive step-by-step simulations, explanations & algorithms for:
   Selection Sort, Bubble Sort, Insertion Sort, Quick Sort, Merge Sort,
   Shell Sort, and Radix Sort.
   ========================================================================== */

const SORT_ALGORITHMS = {
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    badge: 'Time: O(n²) | Space: O(1)',
    tagline: 'Repeatedly find the minimum element from the unsorted suffix and place it at the beginning.',
    defaultArray: [64, 25, 12, 22, 11],
    presets: [
      { label: '[64, 25, 12, 22, 11]', value: '64, 25, 12, 22, 11' },
      { label: '[29, 10, 14, 37, 13]', value: '29, 10, 14, 37, 13' },
      { label: 'Reverse [50, 40, 30, 20, 10]', value: '50, 40, 30, 20, 10' }
    ],
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
      stable: 'No',
      inPlace: 'Yes'
    },
    tip: 'Selection Sort always performs at most (n - 1) swaps, making it useful when memory write operations are expensive.',
    explanation: `
      <p><strong>Selection Sort</strong> divides the array into two conceptual parts: a <em>sorted prefix</em> on the left (initially empty) and an <em>unsorted suffix</em> on the right.</p>
      <ul>
        <li>In each pass <code>i</code> (from <code>0</code> to <code>n - 2</code>), it scans the entire unsorted portion <code>A[i .. n - 1]</code> to locate the index <code>minIdx</code> of the smallest element.</li>
        <li>Once the minimum element is found, it swaps <code>A[i]</code> with <code>A[minIdx]</code>, expanding the sorted prefix by one element.</li>
        <li>Even if the array is already sorted, Selection Sort still scans the remaining elements to verify the minimum, so its best, average, and worst-case time complexities are all <strong>O(n²)</strong>.</li>
        <li>Because it performs at most <code>n - 1</code> swaps, it minimizes write operations compared to Bubble or Insertion Sort.</li>
      </ul>
    `,
    algorithm: [
      'procedure SelectionSort(A, n):',
      '  for i = 0 to n - 2 do',
      '    minIdx = i',
      '    for j = i + 1 to n - 1 do',
      '      if A[j] < A[minIdx] then',
      '        minIdx = j',
      '    if minIdx != i then',
      '      swap(A[i], A[minIdx])',
      '  return A'
    ],
    buildSteps(inputArr) {
      const arr = [...inputArr];
      const n = arr.length;
      const steps = [];
      const sortedSet = new Set();
      let comparisons = 0;
      let swaps = 0;

      const makeStateMap = (extra = {}) => {
        const map = {};
        sortedSet.forEach(idx => { map[idx] = 'found'; });
        return { ...map, ...extra };
      };

      steps.push({
        title: 'Initialize Selection Sort',
        description: `Starting Selection Sort on ${n} elements. The sorted prefix is initially empty.`,
        arrayState: [...arr],
        stateMap: makeStateMap(),
        pointers: [],
        aux: { label: 'Sorted Prefix', value: '0 elements' },
        metrics: { pass: '0', comparisons: 0, swaps: 0, status: 'Ready' },
        activeLines: [1],
        audioAction: null
      });

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        steps.push({
          title: `Pass ${i + 1}: Assume Minimum at Index ${i}`,
          description: `Starting pass ${i + 1}. Assume minIdx = ${i} (value ${arr[i]}). Scan indices ${i + 1} to ${n - 1} for a smaller element.`,
          arrayState: [...arr],
          stateMap: makeStateMap({ [i]: 'current' }),
          pointers: [{ index: i, label: 'MIN', type: 'low' }],
          aux: { label: 'Current Min', value: `A[${minIdx}] = ${arr[minIdx]}` },
          metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Scanning' },
          activeLines: [2, 3],
          audioAction: null
        });

        for (let j = i + 1; j < n; j++) {
          comparisons++;
          const isSmaller = arr[j] < arr[minIdx];

          steps.push({
            title: `Pass ${i + 1}: Compare A[${j}] with A[${minIdx}]`,
            description: `Comparing A[${j}] (${arr[j]}) < A[${minIdx}] (${arr[minIdx]}): ${isSmaller ? 'Yes! Found a new smaller minimum.' : 'No, keep current minimum.'}`,
            arrayState: [...arr],
            stateMap: makeStateMap({ [minIdx]: 'current', [j]: 'compared' }),
            pointers: [
              { index: minIdx, label: 'MIN', type: 'low' },
              { index: j, label: 'j', type: 'target' }
            ],
            aux: { label: 'Current Min', value: `A[${minIdx}] = ${arr[minIdx]}` },
            metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Comparing' },
            activeLines: [4, 5],
            audioAction: 'compare'
          });

          if (isSmaller) {
            minIdx = j;
            steps.push({
              title: `Pass ${i + 1}: Update minIdx = ${minIdx}`,
              description: `Updated minimum index to ${minIdx} (value ${arr[minIdx]}).`,
              arrayState: [...arr],
              stateMap: makeStateMap({ [minIdx]: 'current' }),
              pointers: [{ index: minIdx, label: 'NEW MIN', type: 'low' }],
              aux: { label: 'Current Min', value: `A[${minIdx}] = ${arr[minIdx]}` },
              metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Updated Min' },
              activeLines: [6],
              audioAction: null
            });
          }
        }

        if (minIdx !== i) {
          steps.push({
            title: `Pass ${i + 1}: Swap A[${i}] and A[${minIdx}]`,
            description: `Swapping A[${i}] (${arr[i]}) with minimum element A[${minIdx}] (${arr[minIdx]}).`,
            arrayState: [...arr],
            stateMap: makeStateMap({ [i]: 'shifting', [minIdx]: 'shifting' }),
            pointers: [
              { index: i, label: 'i', type: 'high' },
              { index: minIdx, label: 'MIN', type: 'low' }
            ],
            aux: { label: 'Swap', value: `${arr[i]} ↔ ${arr[minIdx]}` },
            metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Swapping' },
            activeLines: [7, 8],
            audioAction: 'shift'
          });

          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          swaps++;
        }

        sortedSet.add(i);
        steps.push({
          title: `Pass ${i + 1} Complete: A[${i}] = ${arr[i]} Locked`,
          description: `Element ${arr[i]} is now in its final sorted position at index ${i}.`,
          arrayState: [...arr],
          stateMap: makeStateMap(),
          pointers: [{ index: i, label: 'SORTED', type: 'mid' }],
          aux: { label: 'Sorted Prefix', value: `[0 .. ${i}]` },
          metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Pass Done' },
          activeLines: [2],
          audioAction: null
        });
      }

      for (let k = 0; k < n; k++) sortedSet.add(k);
      steps.push({
        title: 'Selection Sort Complete!',
        description: `Array is fully sorted in ascending order: [${arr.join(', ')}]. Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
        arrayState: [...arr],
        stateMap: makeStateMap(),
        pointers: [],
        aux: { label: 'Final Array', value: `[${arr.join(', ')}]` },
        metrics: { pass: 'Done', comparisons, swaps, status: 'Sorted', statusClass: 'found' },
        activeLines: [9],
        audioAction: 'found',
        totalComparisons: comparisons,
        totalSwaps: swaps
      });

      return steps;
    }
  },

  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    badge: 'Time: O(n²) | Space: O(1)',
    tagline: 'Compare adjacent pairs and swap out-of-order elements so the largest values bubble to the end.',
    defaultArray: [5, 1, 4, 2, 8],
    presets: [
      { label: '[5, 1, 4, 2, 8]', value: '5, 1, 4, 2, 8' },
      { label: 'Nearly Sorted [1, 2, 4, 3, 5]', value: '1, 2, 4, 3, 5' },
      { label: 'Reverse [9, 7, 5, 3, 1]', value: '9, 7, 5, 3, 1' }
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes'
    },
    tip: 'Using a swapped boolean flag lets Bubble Sort terminate early in O(n) time when the input array is already sorted.',
    explanation: `
      <p><strong>Bubble Sort</strong> repeatedly steps through the array, compares adjacent pairs <code>A[j]</code> and <code>A[j + 1]</code>, and swaps them if they are in the wrong order.</p>
      <ul>
        <li>After pass 1, the largest element "bubbles up" to the final index <code>n - 1</code>. After pass <code>i</code>, the last <code>i</code> elements are in their final sorted positions.</li>
        <li><strong>Early Termination Optimization:</strong> A <code>swapped</code> flag tracks whether any swap occurred during a pass. If an entire pass makes zero swaps, the array is already sorted and the algorithm stops early.</li>
        <li>Bubble Sort is <strong>stable</strong> (equal elements preserve their relative order) and <strong>in-place</strong>, requiring only O(1) extra memory.</li>
      </ul>
    `,
    algorithm: [
      'procedure BubbleSort(A, n):',
      '  for i = 0 to n - 2 do',
      '    swapped = false',
      '    for j = 0 to n - 2 - i do',
      '      if A[j] > A[j + 1] then',
      '        swap(A[j], A[j + 1])',
      '        swapped = true',
      '    if not swapped then',
      '      break',
      '  return A'
    ],
    buildSteps(inputArr) {
      const arr = [...inputArr];
      const n = arr.length;
      const steps = [];
      const sortedSet = new Set();
      let comparisons = 0;
      let swaps = 0;

      const makeStateMap = (extra = {}) => {
        const map = {};
        sortedSet.forEach(idx => { map[idx] = 'found'; });
        return { ...map, ...extra };
      };

      steps.push({
        title: 'Initialize Bubble Sort',
        description: `Starting Bubble Sort on ${n} elements. Adjacent pairs will be compared from left to right.`,
        arrayState: [...arr],
        stateMap: makeStateMap(),
        pointers: [],
        aux: { label: 'Optimization', value: 'swapped flag active' },
        metrics: { pass: '0', comparisons: 0, swaps: 0, status: 'Ready' },
        activeLines: [1],
        audioAction: null
      });

      for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        steps.push({
          title: `Pass ${i + 1}: Start Scanning Unsorted Prefix [0 .. ${n - 1 - i}]`,
          description: `Beginning pass ${i + 1}. Setting swapped = false and scanning indices 0 through ${n - 2 - i}.`,
          arrayState: [...arr],
          stateMap: makeStateMap(),
          pointers: [],
          aux: { label: 'swapped', value: 'false' },
          metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Scanning' },
          activeLines: [2, 3],
          audioAction: null
        });

        for (let j = 0; j < n - 1 - i; j++) {
          comparisons++;
          const needSwap = arr[j] > arr[j + 1];

          steps.push({
            title: `Pass ${i + 1}: Compare A[${j}] and A[${j + 1}]`,
            description: `Comparing A[${j}] (${arr[j]}) > A[${j + 1}] (${arr[j + 1]}): ${needSwap ? 'True — out of order, will swap!' : 'False — already in order.'}`,
            arrayState: [...arr],
            stateMap: makeStateMap({ [j]: 'compared', [j + 1]: 'compared' }),
            pointers: [
              { index: j, label: 'j', type: 'low' },
              { index: j + 1, label: 'j+1', type: 'high' }
            ],
            aux: { label: 'swapped', value: swapped ? 'true' : 'false' },
            metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Comparing' },
            activeLines: [4, 5],
            audioAction: 'compare'
          });

          if (needSwap) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swaps++;
            swapped = true;

            steps.push({
              title: `Pass ${i + 1}: Swapped A[${j}] ↔ A[${j + 1}]`,
              description: `Swapped values so ${arr[j]} precedes ${arr[j + 1]}. Set swapped = true.`,
              arrayState: [...arr],
              stateMap: makeStateMap({ [j]: 'shifting', [j + 1]: 'shifting' }),
              pointers: [
                { index: j, label: 'j', type: 'low' },
                { index: j + 1, label: 'j+1', type: 'high' }
              ],
              aux: { label: 'swapped', value: 'true' },
              metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Swapped' },
              activeLines: [6, 7],
              audioAction: 'shift'
            });
          }
        }

        sortedSet.add(n - 1 - i);

        if (!swapped) {
          for (let k = 0; k < n; k++) sortedSet.add(k);
          steps.push({
            title: `Pass ${i + 1}: Early Termination!`,
            description: `No swaps occurred during pass ${i + 1} (swapped == false). The array is already sorted!`,
            arrayState: [...arr],
            stateMap: makeStateMap(),
            pointers: [],
            aux: { label: 'swapped', value: 'false → break!' },
            metrics: { pass: `${i + 1}`, comparisons, swaps, status: 'Early Stop' },
            activeLines: [8, 9],
            audioAction: null
          });
          break;
        } else {
          steps.push({
            title: `Pass ${i + 1} Complete: A[${n - 1 - i}] = ${arr[n - 1 - i]} Bubbled`,
            description: `Largest remaining value ${arr[n - 1 - i]} is now settled at index ${n - 1 - i}.`,
            arrayState: [...arr],
            stateMap: makeStateMap(),
            pointers: [{ index: n - 1 - i, label: 'SORTED', type: 'mid' }],
            aux: { label: 'Sorted Suffix', value: `[${n - 1 - i} .. ${n - 1}]` },
            metrics: { pass: `${i + 1} / ${n - 1}`, comparisons, swaps, status: 'Pass Done' },
            activeLines: [2],
            audioAction: null
          });
        }
      }

      for (let k = 0; k < n; k++) sortedSet.add(k);
      steps.push({
        title: 'Bubble Sort Complete!',
        description: `Array is fully sorted: [${arr.join(', ')}]. Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
        arrayState: [...arr],
        stateMap: makeStateMap(),
        pointers: [],
        aux: { label: 'Final Array', value: `[${arr.join(', ')}]` },
        metrics: { pass: 'Done', comparisons, swaps, status: 'Sorted', statusClass: 'found' },
        activeLines: [10],
        audioAction: 'found',
        totalComparisons: comparisons,
        totalSwaps: swaps
      });

      return steps;
    }
  },

  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    badge: 'Time: O(n²) | Space: O(1)',
    tagline: 'Pick each element and insert it into its proper position inside the already-sorted left portion.',
    defaultArray: [12, 11, 13, 5, 6],
    presets: [
      { label: '[12, 11, 13, 5, 6]', value: '12, 11, 13, 5, 6' },
      { label: 'Nearly Sorted [10, 20, 15, 30, 40]', value: '10, 20, 15, 30, 40' },
      { label: 'Reverse [50, 40, 30, 20, 10]', value: '50, 40, 30, 20, 10' }
    ],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes'
    },
    tip: 'Insertion Sort works just like sorting playing cards in your hand — and it is super fast on small or nearly sorted arrays!',
    explanation: `
      <p><strong>Insertion Sort</strong> builds the final sorted array one element at a time, much like sorting playing cards in your hand.</p>
      <ul>
        <li>Assume <code>A[0]</code> is already a sorted sub-array of size 1.</li>
        <li>For each subsequent index <code>i</code> from <code>1</code> to <code>n - 1</code>, store <code>key = A[i]</code>.</li>
        <li>Compare <code>key</code> backwards against elements in the sorted prefix <code>A[0 .. i - 1]</code>, shifting any element greater than <code>key</code> one position to the right.</li>
        <li>Insert <code>key</code> into the vacated slot <code>A[j + 1]</code>.</li>
        <li><strong>Why it shines:</strong> On nearly sorted arrays, the inner <code>while</code> loop exits almost immediately, giving <strong>O(n)</strong> adaptive performance!</li>
      </ul>
    `,
    algorithm: [
      'procedure InsertionSort(A, n):',
      '  for i = 1 to n - 1 do',
      '    key = A[i]',
      '    j = i - 1',
      '    while j >= 0 and A[j] > key do',
      '      A[j + 1] = A[j]',
      '      j = j - 1',
      '    A[j + 1] = key',
      '  return A'
    ],
    buildSteps(inputArr) {
      const arr = [...inputArr];
      const n = arr.length;
      const steps = [];
      let comparisons = 0;
      let writes = 0;

      const sortedPrefixMap = (endIdx, extra = {}) => {
        const map = {};
        for (let k = 0; k <= endIdx; k++) map[k] = 'found';
        return { ...map, ...extra };
      };

      steps.push({
        title: 'Initialize Insertion Sort',
        description: `A[0] = ${arr[0]} forms the initial sorted prefix of length 1. Remaining elements will be inserted one by one.`,
        arrayState: [...arr],
        stateMap: { 0: 'found' },
        pointers: [{ index: 0, label: 'SORTED', type: 'mid' }],
        aux: { label: 'Sorted Prefix', value: `[0 .. 0]` },
        metrics: { pass: '0', comparisons: 0, swaps: 0, status: 'Ready' },
        activeLines: [1],
        audioAction: null
      });

      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        steps.push({
          title: `Pass ${i}: Extract key = A[${i}] (${key})`,
          description: `Picked key = ${key} at index ${i}. Compare leftward against sorted prefix [0 .. ${i - 1}].`,
          arrayState: [...arr],
          stateMap: sortedPrefixMap(i - 1, { [i]: 'current' }),
          pointers: [{ index: i, label: `KEY=${key}`, type: 'target' }],
          aux: { label: 'Key Value', value: `${key} (from idx ${i})` },
          metrics: { pass: `${i} / ${n - 1}`, comparisons, swaps: writes, status: 'Picked Key' },
          activeLines: [2, 3, 4],
          audioAction: null
        });

        while (j >= 0) {
          comparisons++;
          const greater = arr[j] > key;

          steps.push({
            title: `Pass ${i}: Compare A[${j}] (${arr[j]}) > key (${key})`,
            description: greater
              ? `${arr[j]} > ${key} is true. Need to shift A[${j}] right to A[${j + 1}].`
              : `${arr[j]} <= ${key}. Found insertion spot at index ${j + 1}!`,
            arrayState: [...arr],
            stateMap: sortedPrefixMap(i - 1, { [j]: 'compared', [j + 1]: 'current' }),
            pointers: [
              { index: j, label: 'j', type: 'low' },
              { index: j + 1, label: 'SLOT', type: 'target' }
            ],
            aux: { label: 'Key Value', value: `${key}` },
            metrics: { pass: `${i} / ${n - 1}`, comparisons, swaps: writes, status: 'Comparing' },
            activeLines: [5],
            audioAction: 'compare'
          });

          if (!greater) break;

          arr[j + 1] = arr[j];
          writes++;

          steps.push({
            title: `Pass ${i}: Shift A[${j}] → A[${j + 1}]`,
            description: `Shifted ${arr[j + 1]} from index ${j} to index ${j + 1}. Moving pointer j to ${j - 1}.`,
            arrayState: [...arr],
            stateMap: sortedPrefixMap(i, { [j]: 'current', [j + 1]: 'shifting' }),
            pointers: [
              { index: j, label: 'VACANT', type: 'low' },
              { index: j + 1, label: 'SHIFTED', type: 'high' }
            ],
            aux: { label: 'Key Value', value: `${key}` },
            metrics: { pass: `${i} / ${n - 1}`, comparisons, swaps: writes, status: 'Shifting' },
            activeLines: [6, 7],
            audioAction: 'shift'
          });

          j--;
        }

        arr[j + 1] = key;
        if (j + 1 !== i) writes++;

        steps.push({
          title: `Pass ${i}: Insert key (${key}) at Index ${j + 1}`,
          description: `Placed key = ${key} at A[${j + 1}]. Sorted prefix is now [0 .. ${i}].`,
          arrayState: [...arr],
          stateMap: sortedPrefixMap(i, { [j + 1]: 'inserted' }),
          pointers: [{ index: j + 1, label: `INSERTED`, type: 'mid' }],
          aux: { label: 'Sorted Prefix', value: `[0 .. ${i}]` },
          metrics: { pass: `${i} / ${n - 1}`, comparisons, swaps: writes, status: 'Inserted' },
          activeLines: [8],
          audioAction: null
        });
      }

      steps.push({
        title: 'Insertion Sort Complete!',
        description: `Array is fully sorted: [${arr.join(', ')}]. Total comparisons: ${comparisons}, Total shifts/writes: ${writes}.`,
        arrayState: [...arr],
        stateMap: sortedPrefixMap(n - 1),
        pointers: [],
        aux: { label: 'Final Array', value: `[${arr.join(', ')}]` },
        metrics: { pass: 'Done', comparisons, swaps: writes, status: 'Sorted', statusClass: 'found' },
        activeLines: [9],
        audioAction: 'found',
        totalComparisons: comparisons,
        totalSwaps: writes
      });

      return steps;
    }
  },

  quick: {
    id: 'quick',
    name: 'Quick Sort',
    badge: 'Avg: O(n log n) | Space: O(log n)',
    tagline: 'Choose a pivot, partition elements smaller to the left and larger to the right, and recurse.',
    defaultArray: [10, 80, 30, 90, 40, 50, 70],
    presets: [
      { label: '[10, 80, 30, 90, 40, 50, 70]', value: '10, 80, 30, 90, 40, 50, 70' },
      { label: '[38, 27, 43, 3, 9, 82, 10]', value: '38, 27, 43, 3, 9, 82, 10' },
      { label: '[64, 25, 12, 22, 11]', value: '64, 25, 12, 22, 11' }
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
      stable: 'No',
      inPlace: 'Yes'
    },
    tip: 'After each partition step in Quick Sort, the pivot element lands in its exact final sorted index and never moves again!',
    explanation: `
      <p><strong>Quick Sort</strong> is a fast divide-and-conquer sorting algorithm based on partitioning an array around a chosen <em>pivot</em> element (shown here using the classic Lomuto partition scheme where <code>pivot = A[high]</code>).</p>
      <ul>
        <li><strong>Partition:</strong> Maintain boundary pointer <code>i = low - 1</code>. Scan <code>j</code> from <code>low</code> to <code>high - 1</code>; whenever <code>A[j] &le; pivot</code>, increment <code>i</code> and swap <code>A[i]</code> with <code>A[j]</code>.</li>
        <li>Finally, swap <code>A[i + 1]</code> with <code>A[high]</code> (the pivot). Now every element to the left of the pivot is &le; pivot, and every element to the right is &gt; pivot.</li>
        <li><strong>Conquer:</strong> Recursively apply Quick Sort to the left subarray <code>[low .. p - 1]</code> and right subarray <code>[p + 1 .. high]</code>.</li>
        <li>Average time is <strong>O(n log n)</strong> with low constant factors; worst-case <strong>O(n²)</strong> occurs when partitions are maximally unbalanced.</li>
      </ul>
    `,
    algorithm: [
      'procedure QuickSort(A, low, high):',
      '  if low < high then',
      '    p = Partition(A, low, high)',
      '    QuickSort(A, low, p - 1)',
      '    QuickSort(A, p + 1, high)',
      'procedure Partition(A, low, high):',
      '  pivot = A[high]; i = low - 1',
      '  for j = low to high - 1 do',
      '    if A[j] <= pivot then',
      '      i = i + 1; swap(A[i], A[j])',
      '  swap(A[i + 1], A[high])',
      '  return i + 1'
    ],
    buildSteps(inputArr) {
      const arr = [...inputArr];
      const n = arr.length;
      const steps = [];
      const sortedSet = new Set();
      let comparisons = 0;
      let swaps = 0;
      let partitionCount = 0;

      const makeStateMap = (low, high, extra = {}) => {
        const map = {};
        for (let k = 0; k < n; k++) {
          if (sortedSet.has(k)) {
            map[k] = 'found';
          } else if (low !== null && high !== null && (k < low || k > high)) {
            map[k] = 'dimmed';
          }
        }
        return { ...map, ...extra };
      };

      steps.push({
        title: 'Initialize Quick Sort',
        description: `Starting Quick Sort on range [0 .. ${n - 1}] using Lomuto partitioning (pivot = A[high]).`,
        arrayState: [...arr],
        stateMap: makeStateMap(0, n - 1),
        pointers: [],
        aux: { label: 'Active Range', value: `[0 .. ${n - 1}]` },
        metrics: { pass: '0', comparisons: 0, swaps: 0, status: 'Ready' },
        activeLines: [1],
        audioAction: null
      });

      const quickSort = (low, high) => {
        if (low > high) return;
        if (low === high) {
          sortedSet.add(low);
          steps.push({
            title: `Base Case: Single Element A[${low}] = ${arr[low]}`,
            description: `Subarray [${low} .. ${high}] has only 1 element, so A[${low}] (${arr[low]}) is already in its sorted place.`,
            arrayState: [...arr],
            stateMap: makeStateMap(low, high),
            pointers: [{ index: low, label: 'SORTED', type: 'mid' }],
            aux: { label: 'Base Case', value: `Index ${low}` },
            metrics: { pass: `Part #${partitionCount}`, comparisons, swaps, status: 'Base Case' },
            activeLines: [2],
            audioAction: null
          });
          return;
        }

        partitionCount++;
        const pNum = partitionCount;
        const pivot = arr[high];
        let i = low - 1;

        steps.push({
          title: `Partition #${pNum}: Range [${low} .. ${high}], Pivot = ${pivot}`,
          description: `Selected A[${high}] = ${pivot} as pivot. Partitioning indices [${low} .. ${high - 1}] around ${pivot}.`,
          arrayState: [...arr],
          stateMap: makeStateMap(low, high, { [high]: 'pivot' }),
          pointers: [{ index: high, label: `PIVOT=${pivot}`, type: 'high' }],
          aux: { label: 'Partition', value: `[${low} .. ${high}] | Pivot=${pivot}` },
          metrics: { pass: `Part #${pNum}`, comparisons, swaps, status: 'Partitioning' },
          activeLines: [6, 7],
          audioAction: null
        });

        for (let j = low; j < high; j++) {
          comparisons++;
          const lePivot = arr[j] <= pivot;
          const ptrs = [
            { index: j, label: 'j', type: 'target' },
            { index: high, label: 'PIVOT', type: 'high' }
          ];
          if (i >= low) ptrs.push({ index: i, label: 'i', type: 'low' });

          steps.push({
            title: `Partition #${pNum}: Compare A[${j}] (${arr[j]}) ≤ Pivot (${pivot})`,
            description: lePivot
              ? `${arr[j]} ≤ ${pivot} is true. Increment boundary i to ${i + 1}${i + 1 !== j ? ` and swap A[${i + 1}] with A[${j}]` : ' (in place)'}.`
              : `${arr[j]} > ${pivot}. Leave in right region and advance j.`,
            arrayState: [...arr],
            stateMap: makeStateMap(low, high, { [j]: 'compared', [high]: 'pivot' }),
            pointers: ptrs,
            aux: { label: 'Partition', value: `[${low} .. ${high}] | Pivot=${pivot}` },
            metrics: { pass: `Part #${pNum}`, comparisons, swaps, status: 'Comparing' },
            activeLines: [8, 9],
            audioAction: 'compare'
          });

          if (lePivot) {
            i++;
            if (i !== j) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
              swaps++;
              steps.push({
                title: `Partition #${pNum}: Swap A[${i}] ↔ A[${j}]`,
                description: `Moved ${arr[i]} into the ≤ pivot zone at index ${i}; ${arr[j]} moved to index ${j}.`,
                arrayState: [...arr],
                stateMap: makeStateMap(low, high, { [i]: 'shifting', [j]: 'shifting', [high]: 'pivot' }),
                pointers: [
                  { index: i, label: 'i', type: 'low' },
                  { index: j, label: 'j', type: 'target' },
                  { index: high, label: 'PIVOT', type: 'high' }
                ],
                aux: { label: 'Partition', value: `[${low} .. ${high}] | Pivot=${pivot}` },
                metrics: { pass: `Part #${pNum}`, comparisons, swaps, status: 'Swapped' },
                activeLines: [10],
                audioAction: 'shift'
              });
            }
          }
        }

        const pivotPos = i + 1;
        if (pivotPos !== high) {
          [arr[pivotPos], arr[high]] = [arr[high], arr[pivotPos]];
          swaps++;
        }
        sortedSet.add(pivotPos);

        steps.push({
          title: `Partition #${pNum} Done: Pivot ${pivot} Placed at Index ${pivotPos}`,
          description: `Swapped pivot into index ${pivotPos}. All elements in [${low} .. ${pivotPos - 1}] are ≤ ${pivot}, and [${pivotPos + 1} .. ${high}] are > ${pivot}.`,
          arrayState: [...arr],
          stateMap: makeStateMap(low, high, { [pivotPos]: 'found' }),
          pointers: [{ index: pivotPos, label: `LOCKED (${pivot})`, type: 'mid' }],
          aux: { label: 'Pivot Locked', value: `A[${pivotPos}] = ${pivot}` },
          metrics: { pass: `Part #${pNum}`, comparisons, swaps, status: 'Pivot Locked' },
          activeLines: [11, 12],
          audioAction: 'shift'
        });

        quickSort(low, pivotPos - 1);
        quickSort(pivotPos + 1, high);
      };

      quickSort(0, n - 1);

      for (let k = 0; k < n; k++) sortedSet.add(k);
      steps.push({
        title: 'Quick Sort Complete!',
        description: `Array is fully sorted: [${arr.join(', ')}]. Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
        arrayState: [...arr],
        stateMap: makeStateMap(0, n - 1),
        pointers: [],
        aux: { label: 'Final Array', value: `[${arr.join(', ')}]` },
        metrics: { pass: 'Done', comparisons, swaps, status: 'Sorted', statusClass: 'found' },
        activeLines: [1],
        audioAction: 'found',
        totalComparisons: comparisons,
        totalSwaps: swaps
      });

      return steps;
    }
  },

  merge: {
    id: 'merge',
    name: 'Merge Sort',
    badge: 'Time: O(n log n) | Space: O(n)',
    tagline: 'Recursively split the array in half, then merge sorted halves back together in linear time.',
    defaultArray: [38, 27, 43, 3, 9, 82, 10],
    presets: [
      { label: '[38, 27, 43, 3, 9, 82, 10]', value: '38, 27, 43, 3, 9, 82, 10' },
      { label: '[12, 11, 13, 5, 6, 7]', value: '12, 11, 13, 5, 6, 7' },
      { label: 'Reverse [8, 7, 6, 5, 4, 3, 2, 1]', value: '8, 7, 6, 5, 4, 3, 2, 1' }
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
      stable: 'Yes',
      inPlace: 'No'
    },
    tip: 'Merge Sort guarantees O(n log n) worst-case time complexity regardless of input order, and is completely stable.',
    explanation: `
      <p><strong>Merge Sort</strong> is a classic <em>Divide-and-Conquer</em> algorithm with predictable <strong>O(n log n)</strong> performance in all cases.</p>
      <ul>
        <li><strong>Divide:</strong> Find midpoint <code>mid = floor((left + right) / 2)</code> and recursively split the array into two halves <code>[left .. mid]</code> and <code>[mid + 1 .. right]</code> until subarrays reach size 1.</li>
        <li><strong>Conquer &amp; Combine (Merge):</strong> Copy the two sorted halves into temporary arrays <code>L</code> and <code>R</code>, then repeatedly pick the smaller front element from <code>L</code> or <code>R</code> and write it back into <code>A[k]</code>.</li>
        <li><strong>Trade-off:</strong> While Merge Sort requires <strong>O(n)</strong> auxiliary space for merging, it preserves stability and never degrades to O(n²).</li>
      </ul>
    `,
    algorithm: [
      'procedure MergeSort(A, left, right):',
      '  if left >= right then return',
      '  mid = floor((left + right) / 2)',
      '  MergeSort(A, left, mid)',
      '  MergeSort(A, mid + 1, right)',
      '  Merge(A, left, mid, right)',
      'procedure Merge(A, left, mid, right):',
      '  L = A[left..mid], R = A[mid+1..right]',
      '  while L and R non-empty do',
      '    if L[p1] <= R[p2] then A[k++] = L[p1++]',
      '    else A[k++] = R[p2++]',
      '  copy remaining elements of L and R to A'
    ],
    buildSteps(inputArr) {
      const arr = [...inputArr];
      const n = arr.length;
      const steps = [];
      let comparisons = 0;
      let writes = 0;
      let mergeOp = 0;

      const rangeStateMap = (left, right, extra = {}) => {
        const map = {};
        for (let k = 0; k < n; k++) {
          if (k < left || k > right) map[k] = 'dimmed';
        }
        return { ...map, ...extra };
      };

      steps.push({
        title: 'Initialize Merge Sort',
        description: `Starting Merge Sort on ${n} elements. The array will be recursively split in half and merged back in sorted order.`,
        arrayState: [...arr],
        stateMap: {},
        pointers: [],
        aux: { label: 'Phase', value: 'Divide & Conquer' },
        metrics: { pass: '0', comparisons: 0, swaps: 0, status: 'Ready' },
        activeLines: [1],
        audioAction: null
      });

      const mergeSort = (left, right) => {
        if (left >= right) return;
        const mid = Math.floor((left + right) / 2);

        steps.push({
          title: `Divide Range [${left} .. ${right}] at Mid = ${mid}`,
          description: `Splitting [${left} .. ${right}] into Left [${left} .. ${mid}] and Right [${mid + 1} .. ${right}].`,
          arrayState: [...arr],
          stateMap: rangeStateMap(left, right, { [mid]: 'current' }),
          pointers: [
            { index: left, label: 'L', type: 'low' },
            { index: mid, label: 'MID', type: 'mid' },
            { index: right, label: 'R', type: 'high' }
          ],
          aux: {
            label: 'Split Subarrays',
            mergeLeft: arr.slice(left, mid + 1),
            mergeRight: arr.slice(mid + 1, right + 1)
          },
          metrics: { pass: `Merge #${mergeOp}`, comparisons, swaps: writes, status: 'Dividing' },
          activeLines: [3, 4, 5],
          audioAction: null
        });

        mergeSort(left, mid);
        mergeSort(mid + 1, right);

        mergeOp++;
        const mNum = mergeOp;
        const L = arr.slice(left, mid + 1);
        const R = arr.slice(mid + 1, right + 1);
        let p1 = 0;
        let p2 = 0;
        let k = left;

        steps.push({
          title: `Merge #${mNum}: Combine [${L.join(', ')}] & [${R.join(', ')}]`,
          description: `Created temporary subarrays L = [${L.join(', ')}] and R = [${R.join(', ')}]. Merging back into indices [${left} .. ${right}].`,
          arrayState: [...arr],
          stateMap: rangeStateMap(left, right),
          pointers: [
            { index: left, label: 'START', type: 'low' },
            { index: right, label: 'END', type: 'high' }
          ],
          aux: { label: 'Merging', mergeLeft: L, mergeRight: R, p1, p2 },
          metrics: { pass: `Merge #${mNum}`, comparisons, swaps: writes, status: 'Merging' },
          activeLines: [6, 7, 8],
          audioAction: null
        });

        while (p1 < L.length && p2 < R.length) {
          comparisons++;
          const takeLeft = L[p1] <= R[p2];
          const chosenVal = takeLeft ? L[p1] : R[p2];

          arr[k] = chosenVal;
          writes++;

          steps.push({
            title: `Merge #${mNum}: Place ${chosenVal} at A[${k}]`,
            description: `Compared L[${p1}] (${L[p1]}) and R[${p2}] (${R[p2]}). Placed smaller value ${chosenVal} into A[${k}].`,
            arrayState: [...arr],
            stateMap: rangeStateMap(left, right, { [k]: 'inserted' }),
            pointers: [{ index: k, label: `k=${k}`, type: 'mid' }],
            aux: {
              label: `Compare ${L[p1]} vs ${R[p2]}`,
              mergeLeft: L,
              mergeRight: R,
              p1: takeLeft ? p1 + 1 : p1,
              p2: takeLeft ? p2 : p2 + 1
            },
            metrics: { pass: `Merge #${mNum}`, comparisons, swaps: writes, status: 'Merging' },
            activeLines: takeLeft ? [9, 10] : [9, 11],
            audioAction: 'compare'
          });

          if (takeLeft) p1++;
          else p2++;
          k++;
        }

        while (p1 < L.length) {
          arr[k] = L[p1];
          writes++;
          steps.push({
            title: `Merge #${mNum}: Copy Remaining L[${p1}] = ${L[p1]}`,
            description: `Right subarray R is exhausted. Copying remaining L[${p1}] (${L[p1]}) to A[${k}].`,
            arrayState: [...arr],
            stateMap: rangeStateMap(left, right, { [k]: 'shifting' }),
            pointers: [{ index: k, label: `k=${k}`, type: 'low' }],
            aux: { label: 'Copy Remainder', mergeLeft: L, mergeRight: R, p1: p1 + 1, p2 },
            metrics: { pass: `Merge #${mNum}`, comparisons, swaps: writes, status: 'Copying' },
            activeLines: [12],
            audioAction: 'shift'
          });
          p1++;
          k++;
        }

        while (p2 < R.length) {
          arr[k] = R[p2];
          writes++;
          steps.push({
            title: `Merge #${mNum}: Copy Remaining R[${p2}] = ${R[p2]}`,
            description: `Left subarray L is exhausted. Copying remaining R[${p2}] (${R[p2]}) to A[${k}].`,
            arrayState: [...arr],
            stateMap: rangeStateMap(left, right, { [k]: 'shifting' }),
            pointers: [{ index: k, label: `k=${k}`, type: 'high' }],
            aux: { label: 'Copy Remainder', mergeLeft: L, mergeRight: R, p1, p2: p2 + 1 },
            metrics: { pass: `Merge #${mNum}`, comparisons, swaps: writes, status: 'Copying' },
            activeLines: [12],
            audioAction: 'shift'
          });
          p2++;
          k++;
        }

        const mergedHighlight = {};
        for (let idx = left; idx <= right; idx++) mergedHighlight[idx] = 'found';
        steps.push({
          title: `Merge #${mNum} Complete: [${left} .. ${right}] Sorted`,
          description: `Subarray [${left} .. ${right}] is now sorted: [${arr.slice(left, right + 1).join(', ')}].`,
          arrayState: [...arr],
          stateMap: rangeStateMap(left, right, mergedHighlight),
          pointers: [],
          aux: { label: 'Merged Segment', value: `[${arr.slice(left, right + 1).join(', ')}]` },
          metrics: { pass: `Merge #${mNum}`, comparisons, swaps: writes, status: 'Merged' },
          activeLines: [6],
          audioAction: null
        });
      };

      mergeSort(0, n - 1);

      const finalMap = {};
      for (let idx = 0; idx < n; idx++) finalMap[idx] = 'found';
      steps.push({
        title: 'Merge Sort Complete!',
        description: `Array is fully sorted: [${arr.join(', ')}]. Total comparisons: ${comparisons}, Total array writes: ${writes}.`,
        arrayState: [...arr],
        stateMap: finalMap,
        pointers: [],
        aux: { label: 'Final Array', value: `[${arr.join(', ')}]` },
        metrics: { pass: 'Done', comparisons, swaps: writes, status: 'Sorted', statusClass: 'found' },
        activeLines: [1],
        audioAction: 'found',
        totalComparisons: comparisons,
        totalSwaps: writes
      });

      return steps;
    }
  },

  shell: {
    id: 'shell',
    name: 'Shell Sort',
    badge: 'Avg: ~O(n^1.3–n log²n) | Space: O(1)',
    tagline: 'Generalize Insertion Sort by comparing and shifting elements separated by shrinking gap intervals.',
    defaultArray: [23, 12, 1, 8, 34, 54, 2, 3],
    presets: [
      { label: '[23, 12, 1, 8, 34, 54, 2, 3]', value: '23, 12, 1, 8, 34, 54, 2, 3' },
      { label: '[35, 33, 42, 10, 14, 19, 27, 44]', value: '35, 33, 42, 10, 14, 19, 27, 44' },
      { label: '[64, 25, 12, 22, 11]', value: '64, 25, 12, 22, 11' }
    ],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log² n)',
      worst: 'O(n²)',
      space: 'O(1)',
      stable: 'No',
      inPlace: 'Yes'
    },
    tip: 'Shell Sort eliminates large inversions early using wide gaps, so by the final gap = 1 Insertion Sort pass, elements are already close to home!',
    explanation: `
      <p><strong>Shell Sort</strong> (invented by Donald Shell in 1959) improves upon Insertion Sort by allowing elements far apart to move quickly toward their target positions.</p>
      <ul>
        <li>Standard Insertion Sort only shifts elements by 1 position at a time, which is slow when small values are near the far right.</li>
        <li>Shell Sort uses a decreasing sequence of <code>gap</code> values (here: <code>gap = floor(n / 2)</code>, halving each phase until <code>gap = 1</code>).</li>
        <li>For each <code>gap</code>, it performs a <em>gapped insertion sort</em> on elements separated by <code>gap</code> indices (<code>i</code>, <code>i - gap</code>, <code>i - 2·gap</code>...).</li>
        <li>The final phase has <code>gap = 1</code>, which is standard Insertion Sort on an already mostly-ordered array!</li>
      </ul>
    `,
    algorithm: [
      'procedure ShellSort(A, n):',
      '  gap = floor(n / 2)',
      '  while gap > 0 do',
      '    for i = gap to n - 1 do',
      '      temp = A[i]; j = i',
      '      while j >= gap and A[j - gap] > temp do',
      '        A[j] = A[j - gap]',
      '        j = j - gap',
      '      A[j] = temp',
      '    gap = floor(gap / 2)',
      '  return A'
    ],
    buildSteps(inputArr) {
      const arr = [...inputArr];
      const n = arr.length;
      const steps = [];
      let comparisons = 0;
      let writes = 0;
      let gapPhase = 0;

      steps.push({
        title: 'Initialize Shell Sort',
        description: `Starting Shell Sort on ${n} elements. Initial gap will be floor(${n} / 2) = ${Math.floor(n / 2)}.`,
        arrayState: [...arr],
        stateMap: {},
        pointers: [],
        aux: { label: 'Initial Gap', value: `${Math.floor(n / 2)}` },
        metrics: { pass: '0', comparisons: 0, swaps: 0, status: 'Ready' },
        activeLines: [1, 2],
        audioAction: null
      });

      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        gapPhase++;
        steps.push({
          title: `Gap Phase #${gapPhase}: gap = ${gap}`,
          description: `Starting ${gap}-sorting pass. Comparing and inserting elements separated by ${gap} index position(s).`,
          arrayState: [...arr],
          stateMap: {},
          pointers: [],
          aux: { label: 'Active Gap', value: `gap = ${gap}` },
          metrics: { pass: `gap=${gap}`, comparisons, swaps: writes, status: `Gap ${gap}` },
          activeLines: [3],
          audioAction: null
        });

        for (let i = gap; i < n; i++) {
          const temp = arr[i];
          let j = i;

          const subseqMap = {};
          for (let s = i % gap; s < n; s += gap) subseqMap[s] = 'current';

          steps.push({
            title: `Gap ${gap}: Pick temp = A[${i}] (${temp})`,
            description: `Examining element A[${i}] = ${temp} within its ${gap}-gapped subsequence.`,
            arrayState: [...arr],
            stateMap: { ...subseqMap, [i]: 'pivot' },
            pointers: [{ index: i, label: `TEMP=${temp}`, type: 'target' }],
            aux: { label: 'Active Gap', value: `gap = ${gap}, temp = ${temp}` },
            metrics: { pass: `gap=${gap}`, comparisons, swaps: writes, status: `Gap ${gap}` },
            activeLines: [4, 5],
            audioAction: null
          });

          while (j >= gap) {
            comparisons++;
            const greater = arr[j - gap] > temp;

            steps.push({
              title: `Gap ${gap}: Compare A[${j - gap}] (${arr[j - gap]}) > temp (${temp})`,
              description: greater
                ? `${arr[j - gap]} > ${temp} is true. Shift A[${j - gap}] right by ${gap} to A[${j}].`
                : `${arr[j - gap]} <= ${temp}. Stop shifting and place temp at A[${j}].`,
              arrayState: [...arr],
              stateMap: { [j - gap]: 'compared', [j]: 'current' },
              pointers: [
                { index: j - gap, label: `j-gap (${j - gap})`, type: 'low' },
                { index: j, label: `j (${j})`, type: 'high' }
              ],
              aux: { label: 'Active Gap', value: `gap = ${gap}, temp = ${temp}` },
              metrics: { pass: `gap=${gap}`, comparisons, swaps: writes, status: 'Comparing' },
              activeLines: [6],
              audioAction: 'compare'
            });

            if (!greater) break;

            arr[j] = arr[j - gap];
            writes++;

            steps.push({
              title: `Gap ${gap}: Shift A[${j - gap}] → A[${j}]`,
              description: `Moved ${arr[j]} from index ${j - gap} to index ${j}.`,
              arrayState: [...arr],
              stateMap: { [j]: 'shifting', [j - gap]: 'current' },
              pointers: [
                { index: j - gap, label: 'VACANT', type: 'low' },
                { index: j, label: 'SHIFTED', type: 'high' }
              ],
              aux: { label: 'Active Gap', value: `gap = ${gap}, temp = ${temp}` },
              metrics: { pass: `gap=${gap}`, comparisons, swaps: writes, status: 'Shifting' },
              activeLines: [7, 8],
              audioAction: 'shift'
            });

            j -= gap;
          }

          arr[j] = temp;
          if (j !== i) writes++;

          steps.push({
            title: `Gap ${gap}: Place temp (${temp}) at A[${j}]`,
            description: `Inserted ${temp} at index ${j}.`,
            arrayState: [...arr],
            stateMap: { [j]: 'inserted' },
            pointers: [{ index: j, label: 'PLACED', type: 'mid' }],
            aux: { label: 'Active Gap', value: `gap = ${gap}` },
            metrics: { pass: `gap=${gap}`, comparisons, swaps: writes, status: 'Placed' },
            activeLines: [9],
            audioAction: null
          });
        }
      }

      const finalMap = {};
      for (let k = 0; k < n; k++) finalMap[k] = 'found';
      steps.push({
        title: 'Shell Sort Complete!',
        description: `Array is fully sorted after gap=1 final pass: [${arr.join(', ')}]. Comparisons: ${comparisons}, Shifts/Writes: ${writes}.`,
        arrayState: [...arr],
        stateMap: finalMap,
        pointers: [],
        aux: { label: 'Final Array', value: `[${arr.join(', ')}]` },
        metrics: { pass: 'Done', comparisons, swaps: writes, status: 'Sorted', statusClass: 'found' },
        activeLines: [11],
        audioAction: 'found',
        totalComparisons: comparisons,
        totalSwaps: writes
      });

      return steps;
    }
  },

  radix: {
    id: 'radix',
    name: 'Radix Sort',
    badge: 'Time: O(d·(n + k)) | Space: O(n + k)',
    tagline: 'Non-comparative digit-by-digit sort using Base-10 buckets from Least Significant Digit to Most.',
    defaultArray: [170, 45, 75, 90, 802, 24, 2, 66],
    presets: [
      { label: '[170, 45, 75, 90, 802, 24, 2, 66]', value: '170, 45, 75, 90, 802, 24, 2, 66' },
      { label: '[329, 457, 657, 839, 436, 720, 355]', value: '329, 457, 657, 839, 436, 720, 355' },
      { label: '[64, 25, 12, 22, 11]', value: '64, 25, 12, 22, 11' }
    ],
    complexity: {
      best: 'O(d·(n + k))',
      average: 'O(d·(n + k))',
      worst: 'O(d·(n + k))',
      space: 'O(n + k)',
      stable: 'Yes',
      inPlace: 'No'
    },
    tip: 'Radix Sort never compares two array elements against each other! It achieves linear-like speed by grouping numbers into buckets 0–9 digit by digit.',
    explanation: `
      <p><strong>Radix Sort (LSD — Least Significant Digit)</strong> is a <em>non-comparative</em> integer sorting algorithm that sorts numbers digit by digit from the rightmost (units) digit to the leftmost digit.</p>
      <ul>
        <li>Find the maximum number <code>maxVal</code> to know how many digit passes <code>d</code> are needed (<code>exp = 1, 10, 100, ...</code>).</li>
        <li><strong>Distribute:</strong> For the current digit place <code>exp</code>, extract each element's digit <code>(A[i] / exp) % 10</code> and append it into the matching bucket <code>0..9</code>.</li>
        <li><strong>Collect:</strong> Concatenate buckets <code>0</code> through <code>9</code> back into <code>A</code> in FIFO order. Because collection preserves earlier digit order (<strong>stability</strong>), after the most significant digit pass the entire array is sorted!</li>
        <li><strong>Domain Note:</strong> Standard LSD Base-10 Radix Sort operates on <strong>non-negative integers</strong>.</li>
      </ul>
    `,
    algorithm: [
      'procedure RadixSort(A, n):',
      '  maxVal = max(A)',
      '  exp = 1',
      '  while floor(maxVal / exp) > 0 do',
      '    create 10 empty buckets B[0..9]',
      '    for i = 0 to n - 1 do',
      '      digit = floor(A[i] / exp) mod 10',
      '      append A[i] to B[digit]',
      '    collect B[0..9] sequentially back into A',
      '    exp = exp * 10',
      '  return A'
    ],
    validate(arr) {
      for (const x of arr) {
        if (!Number.isInteger(x) || x < 0) {
          return 'LSD Radix Sort requires non-negative integers (0 or greater). Please remove negative or decimal values, or click a Radix preset.';
        }
      }
      return null;
    },
    buildSteps(inputArr) {
      const arr = [...inputArr];
      const n = arr.length;
      const steps = [];
      const maxVal = Math.max(...arr);
      let writes = 0;
      let passNum = 0;

      const cloneBuckets = (b) => b.map(bucket => [...bucket]);

      steps.push({
        title: 'Initialize Radix Sort (Base 10 LSD)',
        description: `Starting LSD Radix Sort on ${n} non-negative integers. Maximum value is ${maxVal}, requiring ${maxVal === 0 ? 1 : Math.floor(Math.log10(maxVal)) + 1} digit pass(es).`,
        arrayState: [...arr],
        stateMap: {},
        pointers: [],
        aux: { label: 'Max Value', value: `${maxVal}`, buckets: Array.from({ length: 10 }, () => []), activeBucket: -1, exp: 1 },
        metrics: { pass: '0', comparisons: '0 (Non-comp)', swaps: 0, status: 'Ready' },
        activeLines: [1, 2, 3],
        audioAction: null
      });

      let exp = 1;
      do {
        passNum++;
        const placeName = exp === 1 ? 'Units (1s)' : exp === 10 ? 'Tens (10s)' : exp === 100 ? 'Hundreds (100s)' : `${exp}s Place`;
        const buckets = Array.from({ length: 10 }, () => []);

        steps.push({
          title: `Digit Pass #${passNum}: ${placeName} (exp = ${exp})`,
          description: `Clearing 10 buckets (0–9) and distributing elements by their ${placeName} digit.`,
          arrayState: [...arr],
          stateMap: {},
          pointers: [],
          aux: { label: 'Digit Place', value: placeName, buckets: cloneBuckets(buckets), activeBucket: -1, exp },
          metrics: { pass: `exp=${exp}`, comparisons: '0', swaps: writes, status: placeName },
          activeLines: [4, 5],
          audioAction: null
        });

        for (let i = 0; i < n; i++) {
          const digit = Math.floor(arr[i] / exp) % 10;
          buckets[digit].push(arr[i]);

          steps.push({
            title: `Pass #${passNum} (${placeName}): A[${i}] = ${arr[i]} → Bucket [${digit}]`,
            description: `floor(${arr[i]} / ${exp}) mod 10 = ${digit}. Placing ${arr[i]} into Bucket ${digit}.`,
            arrayState: [...arr],
            stateMap: { [i]: 'current' },
            pointers: [{ index: i, label: `DIGIT=${digit}`, type: 'mid' }],
            aux: { label: 'Distributing', value: `${arr[i]} → Bucket ${digit}`, buckets: cloneBuckets(buckets), activeBucket: digit, exp },
            metrics: { pass: `exp=${exp}`, comparisons: '0', swaps: writes, status: `Bucket ${digit}` },
            activeLines: [6, 7, 8],
            audioAction: 'compare'
          });
        }

        // Collect phase
        let idx = 0;
        for (let b = 0; b < 10; b++) {
          for (const val of buckets[b]) {
            arr[idx] = val;
            writes++;
            idx++;
          }
        }

        steps.push({
          title: `Pass #${passNum} (${placeName}) Collected Back to Array`,
          description: `Concatenated buckets 0–9 in order. Array after ${placeName} pass: [${arr.join(', ')}].`,
          arrayState: [...arr],
          stateMap: Object.fromEntries(arr.map((_, k) => [k, 'shifting'])),
          pointers: [],
          aux: { label: 'Collected', value: `After ${placeName}`, buckets: cloneBuckets(buckets), activeBucket: -1, exp },
          metrics: { pass: `exp=${exp}`, comparisons: '0', swaps: writes, status: 'Collected' },
          activeLines: [9, 10],
          audioAction: 'shift'
        });

        exp *= 10;
      } while (Math.floor(maxVal / exp) > 0);

      const finalMap = {};
      for (let k = 0; k < n; k++) finalMap[k] = 'found';
      steps.push({
        title: 'Radix Sort Complete!',
        description: `Array is fully sorted: [${arr.join(', ')}]. Zero element-to-element comparisons used; ${writes} bucket writes performed.`,
        arrayState: [...arr],
        stateMap: finalMap,
        pointers: [],
        aux: { label: 'Final Array', value: `[${arr.join(', ')}]` },
        metrics: { pass: 'Done', comparisons: '0', swaps: writes, status: 'Sorted', statusClass: 'found' },
        activeLines: [11],
        audioAction: 'found',
        totalComparisons: 0,
        totalSwaps: writes
      });

      return steps;
    }
  }
};

const SORT_ORDER = ['selection', 'bubble', 'insertion', 'quick', 'merge', 'shell', 'radix'];

const SortingModule = {
  currentAlgoId: 'selection',
  array: [64, 25, 12, 22, 11],
  stepEngine: null,

  init() {
    this.dom = {
      navScroller: document.getElementById('sort-nav-scroller'),
      navLinks: Array.from(document.querySelectorAll('.sort-nav-link[data-sort]')),
      algoTitle: document.getElementById('sort-algo-title'),
      algoTagline: document.getElementById('sort-algo-tagline'),
      algoBadge: document.getElementById('sort-algo-badge'),
      inputArray: document.getElementById('sort-input-array'),
      presetsContainer: document.getElementById('sort-presets-row'),
      btnStart: document.getElementById('sort-btn-start'),
      btnRandom: document.getElementById('sort-btn-random'),
      btnReset: document.getElementById('sort-btn-reset'),
      errorMsg: document.getElementById('sort-error-msg'),
      barsStage: document.getElementById('sort-bars-stage'),
      arrayStage: document.getElementById('sort-array-stage'),
      auxStage: document.getElementById('sort-aux-stage'),
      stepContainer: document.getElementById('sort-step-engine'),
      // Metrics
      metricPass: document.getElementById('sort-metric-pass'),
      metricComps: document.getElementById('sort-metric-comps'),
      metricSwaps: document.getElementById('sort-metric-swaps'),
      metricBest: document.getElementById('sort-metric-best'),
      metricWorst: document.getElementById('sort-metric-worst'),
      metricSpace: document.getElementById('sort-metric-space'),
      metricStatus: document.getElementById('sort-metric-status'),
      // Educational Explanation + Algorithm
      eduExplanation: document.getElementById('sort-edu-explanation'),
      eduCodeTitle: document.getElementById('sort-edu-code-title'),
      eduCodeBlock: document.getElementById('sort-edu-code-block'),
      eduMetaBadges: document.getElementById('sort-edu-meta-badges')
    };

    if (!this.dom.btnStart) return;

    this.stepEngine = new StepEngine({
      container: this.dom.stepContainer,
      onStepRender: (step) => this.renderStep(step),
      onComplete: (step) => this.handleComplete(step)
    });

    // Bind sorting link bar
    this.dom.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const algoId = link.getAttribute('data-sort');
        this.selectAlgorithm(algoId, true);
      });
    });

    // Edge-fade fallback for horizontal sort links on browsers without scroll-driven animations
    this.initScrollerFadeFallback();

    // Controls
    this.dom.btnStart.addEventListener('click', () => this.generateAndStart(true));
    this.dom.btnReset.addEventListener('click', () => this.handleReset());
    this.dom.btnRandom.addEventListener('click', () => this.handleRandom());

    // Initialize default selection
    this.selectAlgorithm('selection', false);
  },

  initScrollerFadeFallback() {
    const scroller = this.dom.navScroller;
    if (!scroller) return;
    if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'scroll()')) {
      return;
    }
    const first = scroller.firstElementChild;
    const last = scroller.lastElementChild;
    if (!first || !last || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, intersectionRatio } of entries) {
        if (target === first) {
          scroller.classList.toggle('more-start', intersectionRatio < 1);
        } else if (target === last) {
          scroller.classList.toggle('more-end', intersectionRatio < 1);
        }
      }
    }, { root: scroller, threshold: 1, rootMargin: '1px' });

    observer.observe(first);
    observer.observe(last);
  },

  selectAlgorithm(algoId, updateHash = true) {
    if (!SORT_ALGORITHMS[algoId]) return;
    if (this.stepEngine) this.stepEngine.pause();

    this.currentAlgoId = algoId;
    const algo = SORT_ALGORITHMS[algoId];

    // Update link states & aria-current
    this.dom.navLinks.forEach(link => {
      const isSelected = link.getAttribute('data-sort') === algoId;
      link.classList.toggle('active', isSelected);
      if (isSelected) {
        link.setAttribute('aria-current', 'page');
        try {
          link.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
        } catch (err) {
          link.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Update header & badges
    if (this.dom.algoTitle) this.dom.algoTitle.textContent = algo.name;
    if (this.dom.algoTagline) this.dom.algoTagline.textContent = algo.tagline;
    if (this.dom.algoBadge) this.dom.algoBadge.textContent = algo.badge;

    // Update complexity metrics
    if (this.dom.metricBest) this.dom.metricBest.textContent = algo.complexity.best;
    if (this.dom.metricWorst) this.dom.metricWorst.textContent = algo.complexity.worst;
    if (this.dom.metricSpace) this.dom.metricSpace.textContent = algo.complexity.space;

    // Update input & presets
    if (this.dom.inputArray) {
      this.dom.inputArray.value = algo.defaultArray.join(', ');
    }
    this.renderPresets(algo);

    // Update explanation & algorithm pseudocode
    this.renderEducation(algo);

    // Update global learning tip if sorting tab is active
    if (window.App && window.App.activeTab === 'sorting') {
      const tipTitle = document.getElementById('global-tip-title');
      const tipText = document.getElementById('global-tip-text');
      if (tipTitle) tipTitle.textContent = `${algo.name} Tip`;
      if (tipText) tipText.textContent = algo.tip;
    }

    if (updateHash) {
      window.location.hash = `sorting-${algoId}`;
    }

    this.hideError();
    this.generateAndStart(false);
  },

  renderPresets(algo) {
    if (!this.dom.presetsContainer) return;
    this.dom.presetsContainer.innerHTML = '<span style="font-size: 0.75rem; color: var(--text-dim);">Presets:</span>';
    algo.presets.forEach(p => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-preset';
      btn.textContent = p.label;
      btn.addEventListener('click', () => {
        this.dom.inputArray.value = p.value;
        this.generateAndStart(true);
      });
      this.dom.presetsContainer.appendChild(btn);
    });
  },

  renderEducation(algo) {
    if (this.dom.eduExplanation) {
      this.dom.eduExplanation.innerHTML = algo.explanation;
    }
    if (this.dom.eduMetaBadges) {
      this.dom.eduMetaBadges.innerHTML = `
        <span class="badge badge-primary">Best: ${algo.complexity.best}</span>
        <span class="badge badge-warning">Avg: ${algo.complexity.average}</span>
        <span class="badge badge-danger">Worst: ${algo.complexity.worst}</span>
        <span class="badge badge-success">Space: ${algo.complexity.space}</span>
        <span class="badge badge-mono">Stable: ${algo.complexity.stable}</span>
        <span class="badge badge-mono">In-Place: ${algo.complexity.inPlace}</span>
      `;
    }
    if (this.dom.eduCodeTitle) {
      this.dom.eduCodeTitle.textContent = `${algo.name} Algorithm`;
    }
    if (this.dom.eduCodeBlock) {
      this.dom.eduCodeBlock.innerHTML = '';
      algo.algorithm.forEach((line, idx) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'algo-code-line';
        lineEl.dataset.line = String(idx + 1);

        const numSpan = document.createElement('span');
        numSpan.className = 'algo-line-num';
        numSpan.textContent = String(idx + 1).padStart(2, '0');

        const codeSpan = document.createElement('span');
        codeSpan.className = 'algo-line-text';
        codeSpan.textContent = line;

        lineEl.appendChild(numSpan);
        lineEl.appendChild(codeSpan);
        this.dom.eduCodeBlock.appendChild(lineEl);
      });
    }
  },

  highlightCodeLines(activeLines = []) {
    if (!this.dom.eduCodeBlock) return;
    const set = new Set(activeLines.map(String));
    const lines = this.dom.eduCodeBlock.querySelectorAll('.algo-code-line');
    lines.forEach(el => {
      el.classList.toggle('is-active-line', set.has(el.dataset.line));
    });
  },

  handleRandom() {
    const len = this.currentAlgoId === 'radix' ? 7 : Math.floor(Math.random() * 3) + 6;
    const maxVal = this.currentAlgoId === 'radix' ? 950 : 90;
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(Math.floor(Math.random() * maxVal) + 2);
    }
    this.dom.inputArray.value = arr.join(', ');
    this.generateAndStart(true);
  },

  handleReset() {
    const algo = SORT_ALGORITHMS[this.currentAlgoId];
    this.dom.inputArray.value = algo.defaultArray.join(', ');
    this.hideError();
    this.generateAndStart(false);
  },

  showError(msg) {
    if (this.dom.errorMsg) {
      this.dom.errorMsg.textContent = msg;
      this.dom.errorMsg.style.display = 'flex';
      if (window.soundEngine) window.soundEngine.playError();
    }
  },

  hideError() {
    if (this.dom.errorMsg) {
      this.dom.errorMsg.style.display = 'none';
      this.dom.errorMsg.textContent = '';
    }
  },

  generateAndStart(autoPlay = true) {
    this.hideError();
    const rawArr = this.dom.inputArray.value;
    let arr;
    try {
      arr = ArrayVisualizer.parseInput(rawArr);
    } catch (e) {
      this.showError(e.message);
      return;
    }

    if (arr.length < 2) {
      this.showError('Please enter at least 2 numbers separated by commas to simulate sorting.');
      return;
    }

    if (arr.length > 12) {
      this.showError('Maximum 12 elements allowed so bars, cells, and pointers remain clearly readable.');
      return;
    }

    const algo = SORT_ALGORITHMS[this.currentAlgoId];
    if (typeof algo.validate === 'function') {
      const err = algo.validate(arr);
      if (err) {
        this.showError(err);
        return;
      }
    }

    this.array = [...arr];
    const steps = algo.buildSteps(arr);
    this.stepEngine.setSteps(steps, 0);

    if (autoPlay) {
      this.stepEngine.play();
    }
  },

  renderBars(arr, stateMap = {}) {
    if (!this.dom.barsStage) return;
    this.dom.barsStage.innerHTML = '';
    if (!arr || arr.length === 0) return;

    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    const minShift = minVal < 0 ? Math.abs(minVal) : 0;
    const adjustedMax = maxVal + minShift || 1;

    const wrap = document.createElement('div');
    wrap.className = 'sort-bars-row';

    arr.forEach((val, idx) => {
      const col = document.createElement('div');
      col.className = 'sort-bar-col';

      const state = stateMap[idx];
      if (state) {
        if (Array.isArray(state)) {
          state.forEach(s => col.classList.add(`is-${s}`));
        } else {
          col.classList.add(`is-${state}`);
        }
      }

      const pct = Math.max(14, Math.round(((val + minShift) / adjustedMax) * 100));

      const bar = document.createElement('div');
      bar.className = 'sort-bar';
      bar.style.height = `${pct}%`;

      const label = document.createElement('span');
      label.className = 'sort-bar-val';
      label.textContent = val;

      col.appendChild(label);
      col.appendChild(bar);
      wrap.appendChild(col);
    });

    this.dom.barsStage.appendChild(wrap);
  },

  renderAux(aux) {
    if (!this.dom.auxStage) return;
    if (!aux) {
      this.dom.auxStage.innerHTML = '';
      this.dom.auxStage.style.display = 'none';
      return;
    }

    this.dom.auxStage.style.display = 'block';

    // Radix Sort 10-Bucket Visualization
    if (aux.buckets) {
      let html = `
        <div class="aux-header">
          <span class="aux-title">${aux.label || 'Radix Buckets'}</span>
          <span class="badge badge-primary">${aux.value || ''}</span>
        </div>
        <div class="radix-buckets-grid">
      `;
      aux.buckets.forEach((bucket, digit) => {
        const isActive = digit === aux.activeBucket;
        html += `
          <div class="radix-bucket ${isActive ? 'is-active' : ''}">
            <div class="radix-bucket-label">Bucket ${digit}</div>
            <div class="radix-bucket-items">
              ${bucket.length === 0
                ? '<span class="radix-empty">—</span>'
                : bucket.map(v => `<span class="radix-chip">${v}</span>`).join('')}
            </div>
          </div>
        `;
      });
      html += '</div>';
      this.dom.auxStage.innerHTML = html;
      return;
    }

    // Merge Sort L & R Temporary Subarrays Visualization
    if (aux.mergeLeft || aux.mergeRight) {
      const renderChips = (list, pointerIdx) => list.map((v, i) => {
        const used = pointerIdx !== undefined && i < pointerIdx;
        const active = pointerIdx !== undefined && i === pointerIdx;
        return `<span class="merge-chip ${used ? 'is-used' : ''} ${active ? 'is-next' : ''}">${v}</span>`;
      }).join('');

      this.dom.auxStage.innerHTML = `
        <div class="aux-header">
          <span class="aux-title">${aux.label || 'Subarrays'}</span>
        </div>
        <div class="merge-subarrays-wrap">
          <div class="merge-subarray-box">
            <span class="merge-sub-label">Left (L):</span>
            <div class="merge-chips">${renderChips(aux.mergeLeft || [], aux.p1)}</div>
          </div>
          <div class="merge-subarray-box">
            <span class="merge-sub-label">Right (R):</span>
            <div class="merge-chips">${renderChips(aux.mergeRight || [], aux.p2)}</div>
          </div>
        </div>
      `;
      return;
    }

    // Standard single-line auxiliary pill
    this.dom.auxStage.innerHTML = `
      <div class="aux-inline-pill">
        <span class="aux-title">${aux.label}:</span>
        <code class="aux-value">${aux.value}</code>
      </div>
    `;
  },

  renderStep(step) {
    if (!step) return;
    this.renderBars(step.arrayState, step.stateMap);
    ArrayVisualizer.render(
      this.dom.arrayStage,
      step.arrayState,
      step.stateMap,
      step.pointers
    );
    this.renderAux(step.aux);
    this.highlightCodeLines(step.activeLines || []);

    if (step.metrics) {
      if (this.dom.metricPass) this.dom.metricPass.textContent = step.metrics.pass !== undefined ? step.metrics.pass : '—';
      if (this.dom.metricComps) this.dom.metricComps.textContent = step.metrics.comparisons !== undefined ? step.metrics.comparisons : '0';
      if (this.dom.metricSwaps) this.dom.metricSwaps.textContent = step.metrics.swaps !== undefined ? step.metrics.swaps : '0';
      if (this.dom.metricStatus) {
        this.dom.metricStatus.textContent = step.metrics.status || 'Ready';
        this.dom.metricStatus.className = `metric-value ${step.metrics.statusClass || ''}`;
      }
    }
  },

  handleComplete(finalStep) {
    if (window.historyManager && finalStep) {
      const algo = SORT_ALGORITHMS[this.currentAlgoId];
      const comps = finalStep.totalComparisons !== undefined ? finalStep.totalComparisons : 0;
      const swaps = finalStep.totalSwaps !== undefined ? finalStep.totalSwaps : 0;
      window.historyManager.addEntry(
        'sorting',
        algo.name,
        `Sorted [${finalStep.arrayState.join(', ')}] (${comps} comparisons, ${swaps} swaps/writes).`,
        'Sorted',
        'success'
      );
    }
  }
};

window.SORT_ALGORITHMS = SORT_ALGORITHMS;
window.SORT_ORDER = SORT_ORDER;
window.SortingModule = SortingModule;

