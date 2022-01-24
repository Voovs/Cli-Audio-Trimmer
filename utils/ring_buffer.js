#!/usr/bin/env node
exports.RingBuffer = RingBuffer;
// A double ended ring buffer
// Prototype:
//     length() -> Int: Returns number of elements in the current ring
//     capacity() -> Int: Returns maximum number of elements ring can store
//     is_full() -> Bool: True when buffer is full, false otherwise
//     is_empty() -> Bool: True when buffer is empty, false otherwise
//     intoArray() -> Array: Returns current ring as contiguous array
//     forEach(callback): Loops over all elements in ring
//
//     ~~ Getters and setters ~~
//     push_front(el) -> Bool:
//         Pushes element to the front of the ring. Returns true if the ring
//         has enough capacity left for the push or false otherwise
//     push_back(el) -> Bool:
//         Pushes element to the back of the ring. Returns true if the ring has
//         enough capacity left for the push or false otherwise
//     force_push_front(el):
//         Pushes element to the front of the ring. Overwrites back element if
//         ring capacity has been reached
//     force_push_back(el):
//         Pushes element to the back of the ring. Overwrites back element if
//         ring capacity has been reached
//     pop_front() -> Any | null:
//         Returns and removes the front element of the ring. Return null if
//         the ring is empty
//     pop_back() -> Any | null:
//         Returns and removes the back element of the ring. Return null if
//         the ring is empty
//     get(i) -> Any | null:
//         Returns element at index `i`. Null if the ring is empty. Negative
//         indexing is supported and starts from -1
//     set(Any) -> Bool:
//         Overwrites element at index `i`. Returns false if index is invalid.
//         Negative indexing is supported and starts from -1
//
//     ~~ Mutators ~~
//     fill(element): Fill buffer with given element
//     resize(size) -> Bool:
//         Set ring's size. Size must be able to hold all current elements.
//         True when resize succeeds, false otherwise
//     shrink_to_fit():
//         Resize ring to smallest size containing all current elements
//     map(callback): In-place sets each element of ring to return of callback
//     trim(reserve) -> Bool:
//         Removes all elements from ring buffer, excluding `reserve` number on
//         each side. Resulting ring will have length `reserve * 2`. Returns
//         true if the ring was trimmed successfully and false if `reserve` is
//         too large

// Create a new ring buffer with set size
// Args:
//     size <Int>: Maximum buffer capacity. This cannot be decreased
//     fill [Any]: Optional. Fill initial buffer with this
function RingBuffer(size, fill) {
    this.buffer = new Array(size);
    this.size   = size;
    this.front  = 0;  // Front pointer
    this.back   = 0;
    this.len    = 0;  // Buffer length

    if (typeof fill !== "undefined") this.fill(fill);
}


/*─────────────────────────────────────────────────────────────────────────────╗
│ Bαs𝓲c mετhδds                                                                |
╚─────────────────────────────────────────────────────────────────────────────*/
RingBuffer.prototype.length = function () {
    return this.len
};

RingBuffer.prototype.capacity = function () {
    return this.size
};

RingBuffer.prototype.is_full = function () {
    return this.length() === this.capacity()
};

RingBuffer.prototype.is_empty = function () {
    return this.len === 0
};

/*─────────────────────────────────────────────────────────────────────────────╗
│ Pδrτs frδm Arrαy δbjεcτ                                                      |
╚─────────────────────────────────────────────────────────────────────────────*/
RingBuffer.prototype.fill = function (el) {
    this.buffer.fill(el);
    this.front  = 0;
    this.back   = this.capacity() - 1;
    this.len    = this.capacity();
};

// Returns:
//     True: Buffer has been resized
//     False: New size is smaller than current length
RingBuffer.prototype.resize = function (new_size) {
    if (new_size < this.length())
        return false;

    let buffer = this.intoArray();

    this.buffer = new Array(new_size);
    this.size = new_size;
    this.len = this.front = this.back = 0;

    buffer.forEach((el) => this.push_back(el));

    return true;
};

RingBuffer.prototype.shrink_to_fit = function () {
    this.resize(this.length());
};

// Map elements in-place
RingBuffer.prototype.map = function (callback) {
    const length = this.length();

    for (let i = 0; i < length; i++) {
        let index = i + this.front;

        if (index >= this.capacity())
            index -= this.capacity();

        this.buffer[index] = callback(this.buffer[index], i);
    }
};

RingBuffer.prototype.forEach = function (callback) {
    const length = this.length();

    for (let i = 0; i < length; i++) {
        let index = i + this.front;

        if (index >= this.capacity())
            index -= this.capacity();

        callback(this.buffer[index], i);
    }
};

// Return an array representation of the ring buffer. Elements are guaranteed
// to be contiguous this way
RingBuffer.prototype.intoArray = function () {
    const ending_index = (this.back < this.front) ? this.capacity()
                                                  : this.back + 1;
    // Front -> back or end of array
    const front_slice = this.buffer.slice(this.front, ending_index);
    // 0 -> back
    const back_slice = this.buffer.slice(0, this.back + 1);

    if (this.is_empty())
        return [];
    else if (this.front < this.back)
        return front_slice;
    else
        return front_slice.concat(back_slice);
};


/*─────────────────────────────────────────────────────────────────────────────╗
│ Frδnτ mετhδds                                                                |
╚─────────────────────────────────────────────────────────────────────────────*/
// Prepend element to the ring buffer
// Returns: false if the buffer was full
RingBuffer.prototype.push_front = function (el) {
    if (this.length() === this.capacity())
        return false;

    if (this.length() > 0 && --this.front < 0)
        this.front = this.capacity() - 1;

    this.buffer[this.front] = el;
    this.len++;

    return true
};


// Prepend element to the ring buffer, overwriting the last element if there
// isn't enough space
RingBuffer.prototype.force_push_front = function (el) {
    if (this.length() < this.capacity()) {
        this.push_front(el);
    } else {
        if (--this.front < 0)
            this.front = this.capacity() - 1;

        if (this.back === this.front && --this.back < 0)
            this.back = this.capacity() - 1;

        this.buffer[this.front] = el;
    }
};


// Removes and returns the front element. Null if the ring buffer is empty
RingBuffer.prototype.pop_front = function () {
    if (this.length() === 0)
        return null;

    const el = this.buffer[this.front];

    if (this.length() > 1 && ++this.front === this.capacity())
            this.front = 0;

    this.len--;
    return el
};


/*─────────────────────────────────────────────────────────────────────────────╗
│ Bαck mετhδds                                                                 |
╚─────────────────────────────────────────────────────────────────────────────*/
// Append element to the ring buffer
// Returns: false if the buffer was full
RingBuffer.prototype.push_back = function (el) {
    if (this.length() === this.capacity())
        return false;

    if (this.length() > 0 && ++this.back >= this.capacity())
        this.back = 0;

    this.buffer[this.back] = el;
    this.len++;

    return true;
};


// Append element to the ring buffer, overwriting the first element if there
// isn't enough space
RingBuffer.prototype.force_push_back = function (el) {
    if (this.length() < this.capacity()) {
        this.push_back(el);
    } else {
        if (++this.back === this.capacity())
            this.back = 0;

        if (this.front === this.back && ++this.front === this.capacity())
            this.front = 0;

        this.buffer[this.back] = el;
    }
};


// Removes and returns the back element. Null if the ring buffer is empty
RingBuffer.prototype.pop_back = function () {
    if (this.length() === 0)
        return null;

    const el = this.buffer[this.back];

    if (this.length() > 1 && --this.back < 0)
            this.back = this.capacity() - 1;

    this.len--;
    return el
};


/*─────────────────────────────────────────────────────────────────────────────╗
│ Dδμblε εndεd mετhδds                                                         |
╚─────────────────────────────────────────────────────────────────────────────*/
// Return element at specified index without removing it from the ring buffer.
// Returns null when index is invalid. Negative indexing words, starting from -1
RingBuffer.prototype.get = function (i) {
    let index;

    if (i >= 0 && i < this.length())
        index = this.front + i;
    else if (i < 0 && Math.abs(i) <= this.length())  // Negative indexing from -1
        index = this.back + i + 1;
    else
        return null

    if (index < 0)
        return this.buffer[this.capacity() + index];
    else if (index < this.capacity())
        return this.buffer[index];
    else
        return this.buffer[index - this.capacity()];
};


// Set element at specified index, overwriting previous element there. Index
// can be negative, though cannot exceed the current length of the buffer
// Returns:
//     True when element was successfully inserted. False when the index is
//     invalid
RingBuffer.prototype.set = function (el, i) {
    let index;

    if (this.is_empty() && i === 0)
        return this.push_back(el)

    // Find index into ring
    if (i >= 0 && i < this.length())
        index = this.front + i;
    else if (i < 0 && Math.abs(i) <= this.length())  // Negative indexing from -1
        index = this.back + i + 1;
    else
        return false

    if (index < 0)
        this.buffer[this.capacity() + index] = el;
    else if (index < this.capacity())
        this.buffer[index] = el;
    else
        this.buffer[index - this.capacity()] = el;

    return true
};


// Remove middle section of ring buffer, keeping only `x` elements on either
// side
// Returns: True for a successful trim, false when `x` is too large
RingBuffer.prototype.trim = function (x = 1) {
    const rm_count = this.length() - 2 * x;

    if (rm_count < 0 || x < 0) {
        return false;
    } else if (x === 0) {
        this.len = this.back = this.front = 0;
        return true;
    }

    for (let i = 0; i < x; i++) {
        let front_index = this.front + x + i;
        let back_index  = this.back  - x + i + 1;

        if (front_index >= this.capacity())
            front_index -= this.capacity();

        if (back_index < 0)
            back_index = this.capacity() + back_index;

        this.buffer[front_index] = this.buffer[back_index];
    }

    if ((this.back = this.front + 2 * x - 1) >= this.capacity())
        this.back -= this.capacity();

    this.len = 2 * x;
    return true;
};


/*─────────────────────────────────────────────────────────────────────────────╗
│ Un𝓲τ τεsτ𝓲ng αnd εxαmplεs                                                    |
╚─────────────────────────────────────────────────────────────────────────────*/
function _runUnitTests() {
    _unitTestConstruct();
    _unitTestFrontMethods();
    _unitTestFrontMethods();
    _unitTestSampleUse();
}


function _unitTestConstruct() {
    let ring = new RingBuffer(10);

    console.assert(ring.capacity() === 10, "Ring size is 10");
    console.assert(ring.is_empty(), "Newly created ring isn't empty");

    console.assert(!ring.get(0), "Managed to .get(0) in empty buffer");
    console.assert(ring.set(1, 0), "Couldn't set in empty ring buffer");
    console.assert(ring.get(0), "Failed to .get(0) after setting");
    console.assert(ring.length() === 1, "Failed to increment length on set");

    ring = new RingBuffer(0);
    console.assert(ring.capacity() === 0, "Ring size is 0");
}


function _unitTestFrontMethods() {
    let ring = new RingBuffer(4);

    const init_front = ring.front;

    console.assert(ring.push_front("string4"), "first push");
    console.assert(ring.front === init_front,
        `Ring improperly moved front pointer ${ring.front} on first .push_front()`);

    console.assert(ring.push_front("string3"), "second push");
    console.assert(ring.front - init_front === 1 || ring.front === ring.capacity() - 1,
        `Ring improperly moved front pointer ${ring.front} on second .push_front()`);

    console.assert(ring.push_front("string2"), "third push");
    console.assert(ring.push_front("string1"), "fourth push");

    console.assert(!ring.push_front("overflow"), "This push should overflow");
    console.assert(!ring.push_front("overflow2"), "This push should overflow too");

    console.assert(ring.get(0) === "string1", "Positive index get(0) didn't work");
    console.assert(ring.get(1) === "string2", "Positive index get(1) didn't work");
    console.assert(ring.get(2) === "string3", "Positive index get(2) didn't work");
    console.assert(ring.get(3) === "string4", "Positive index get(3) didn't work");

    console.assert(ring.get(-1) === "string4", "Negative index get(-1) didn't work");
    console.assert(ring.get(-2) === "string3", "Negative index get(-2) didn't work");
    console.assert(ring.get(-3) === "string2", "Negative index get(-3) didn't work");
    console.assert(ring.get(-4) === "string1", "Negative index get(-4) didn't work");

    console.assert(ring.get(-1) === ring.get(ring.length() - 1),
        "Symmetric indexing with .get(-1) doesn't work");

    console.assert(ring.get(-3) === ring.get(ring.length()-3),
        "Symmetric indexing with .get(-3) doesn't work");

    console.assert(ring.pop_front() === "string1", "First .pop_front() failed");
    console.assert(ring.length() === 3, "First .pop_front() didn't change length");
    console.assert(ring.pop_front() === "string2", "Second .pop_front() failed");
    console.assert(ring.length() === 2, "Second .pop_front() didn't change length");
    console.assert(ring.get(0) === ring.pop_front(),
        ".get(0) is the same as .pop_front()");
    console.assert(ring.length() === 1, "Third .pop_front() didn't change length");
    console.assert(ring.get(-1) === ring.get(0),
        "Symmetric indexing for the same element with .get() doesn't work");
    console.assert(ring.get(-1) === ring.pop_front(),
        "Last element not removed from .pop_front()");

    console.assert(ring.length() === 0, "Length of empty buffer not 0");

    console.assert(ring.push_front("overwrite1"),
        "Failed to push_front() the first overwriting element");
    console.assert(ring.get(-1) === ring.get(0),
        "Symmetric indexing overwritten element with .get() doesn't work");
    console.assert(ring.push_front("overwrite2"),
        "Failed to push_front() the first overwriting element");
    console.assert(ring.length() === 2, "Wrong length after overwrite");
}


function _unitTestBackMethods() {
    let ring = new RingBuffer(4);

    const init_back = ring.front;

    console.assert(ring.push_back("string4"), "first push");
    console.assert(ring.back === init_back,
        `Ring improperly moved back pointer ${ring.back} on first .push_back()`);

    console.assert(ring.push_back("string3"), "second push");
    console.assert(ring.back - init_back === 1 || ring.back === ring.capacity() - 1,
        `Ring improperly moved back pointer ${ring.back} on second .push_back()`);

    console.assert(ring.push_back("string2"), "third push");
    console.assert(ring.push_back("string1"), "fourth push");

    console.assert(!ring.push_back("overflow"), "This push should overflow");
    console.assert(!ring.push_back("overflow2"), "This push should overflow too");

    console.assert(ring.get(0) === "string4", "Positive index get(0) didn't work");
    console.assert(ring.get(1) === "string3", "Positive index get(1) didn't work");
    console.assert(ring.get(2) === "string2", "Positive index get(2) didn't work");
    console.assert(ring.get(3) === "string1", "Positive index get(3) didn't work");

    console.assert(ring.get(-1) === "string1", "Negative index get(-1) didn't work");
    console.assert(ring.get(-2) === "string2", "Negative index get(-2) didn't work");
    console.assert(ring.get(-3) === "string3", "Negative index get(-3) didn't work");
    console.assert(ring.get(-4) === "string4", "Negative index get(-4) didn't work");

    console.assert(ring.get(-1) === ring.get(ring.length() - 1),
        "Symmetric indexing with .get(-1) doesn't work");

    console.assert(ring.get(-3) === ring.get(ring.length()-3),
        "Symmetric indexing with .get(-3) doesn't work");

    console.assert(ring.pop_back() === "string1", "First .pop_back() failed");
    console.assert(ring.length() === 3, "First .pop_back() didn't change length");
    console.assert(ring.pop_back() === "string2", "Second .pop_back() failed");
    console.assert(ring.length() === 2, "Second .pop_back() didn't change length");
    console.assert(ring.get(-1) === ring.pop_back(),
        ".get(0) is the same as .pop_back()");
    console.assert(ring.length() === 1, "Third .pop_back() didn't change length");
    console.assert(ring.get(-1) === ring.get(0),
        "Symmetric indexing for the same element with .get() doesn't work");
    console.assert(ring.get(-1) === ring.pop_back(),
        "Last element not removed from .pop_back()");

    console.assert(ring.is_empty(), "Length of empty buffer not 0");

    console.assert(ring.push_back("overwrite1"),
        "Failed to push_back() the first overwriting element");
    console.assert(ring.get(-1) === ring.get(0),
        "Symmetric indexing overwritten element with .get() doesn't work");
    console.assert(ring.push_back("overwrite2"),
        "Failed to push_back() the second overwriting element");
    console.assert(ring.length() === 2, "Wrong length after overwrite");
    console.assert(ring.push_back("overwrite3"),
        "Failed to push_back() the third overwriting element");
    console.assert(ring.length() === 3, "Wrong length after overwrite");
    console.assert(ring.push_back("overwrite4"),
        "Failed to push_back() the third overwriting element");
    console.assert(ring.length() === 4, "Wrong length after overwrite");
}


function _unitTestSampleUse() {
    let ring = new RingBuffer(10);

    console.assert(ring.is_empty(), "New ring isn't empty");
    console.assert(ring.capacity() === 10,
        `Allocated capacity is ${ring.capacity()} expected 10`);

    ring.fill("word");

    console.assert(!ring.is_empty(), "Filled ring is still empty");
    console.assert(ring.is_full(), "Filled ring isn't full");
    console.assert(ring.capacity() === 10, "Capacity changed from fill()");

    for (let i = 0; i < ring.length(); i++) {
        console.assert(ring.get(i) === "word",
            `ring.get(${i}) was ${ring.get(i)}. Expected null`);
    }

    console.assert(ring.set("new", 3), "Setting index 3 returned false");
    console.assert(ring.get(3) === "new",
        "Set wrong index. Cannot be retrived by .get()");


    ring.map((el, i) => (i % 2 === 1) ? "Odd" : el);

    for (let i = -2; i >= -ring.length(); i -= 2)
        console.assert(ring.set("Even", i),
            `ring.set("Even", ${i}) failed to set`);

    ring.forEach((el, i) => {
        if (i % 2 === 0)
            console.assert(el === "Even", `Expected "Even" at ${i}, got ${el}`);
        else
            console.assert(el === "Odd", `Expected "Odd" at ${i}, got ${el}`);
    });

    for (let i = 0; i < ring.length() / 2; i++)
        console.assert(ring.pop_front(),
            `Failed to .pop_front() on iteration ${i}`);

    let ring2 = new RingBuffer(10, 0);
    ring2.map((_, i) => i);
    ring2.pop_front();
    ring2.pop_front();
    ring2.pop_back();
    ring2.pop_back();
    console.assert(_arraysEqual(ring2.intoArray(), [2, 3, 4, 5, 6, 7]),
        `Expected: ${ring2.intoArray()} === [2, 3, 4, 5, 6, 7]`);

    ring2.trim(2);
    ring2.map((el) => 2 * el);
    console.assert(_arraysEqual(ring2.intoArray(), [4, 6, 12, 14]),
        `Expected: ${ring2.intoArray()} === [4, 6, 12, 14]`);

    for (let i = 0; i < ring2.capacity(); i++)
        ring2.force_push_back(i + 40);

    console.assert(!ring2.trim(6), "Trim kept more elements than capacity");
    console.assert(ring2.trim(3), "Trim failed with enough elements");

    console.assert(_arraysEqual(ring2.intoArray(), [40, 41, 42, 47, 48, 49]),
        `Expected: ${ring2.intoArray()} === [40, 41, 42, 47, 48, 49]`);

    ring2.pop_front();
    ring2.pop_front();
    ring2.shrink_to_fit();
    console.assert(_arraysEqual(ring2.intoArray(), [42, 47, 48, 49]),
        `Expected: ${ring2.intoArray()} === [42, 47, 48, 49]`);

    ring2.resize(10);
    console.assert(_arraysEqual(ring2.intoArray(), [42, 47, 48, 49]),
        `Expected resize: ${ring2.intoArray()} === [42, 47, 48, 49]`);
}

// True if two arrays have the same elements
function _arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i)
    if (a[i] !== b[i])
        return false;

  return true;
}
