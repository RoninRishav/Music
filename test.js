let numbers = [1, 2, 3, 4, 5];
let filtered = numbers.filter(num => num > 2);
console.log(filtered); // [3, 4, 5]

let words = [{w: "hello"}, {w: "jello"}, {w: "mello"}, {W: "FELO"}];
filtered = words.filter(word => word.w);
console.log(filtered);

let song = [{title: "haam tum sath sath"},{title: "hora hora"}];

let input = document.querySelector('.input')

input.addEventListener("input", () => {
    let searchTerm = input.value.toLowerCase().trim();

    filtered = song.filter(s => s.title.includes(searchTerm))

    

    console.log(filtered);
})