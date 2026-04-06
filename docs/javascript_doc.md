**Noteworthy Code**

console.log(errorMesseage);
console.warn(errorMesseage);
console.error(errorMesseage);

```javascript
search_query.replace(" ", "+")          // only replaces the first space with the symbol + 
search_query.replace(/ /g, "+")         // replaces all spaces (and only space characters) with the symbol + 
header.innerText.replace(/\s+/g, '-')   // /g is for pglocab replacement, \s+ is all white space characters (even \t, \n)
                                        // "My Section Title" => "My-Section-Title"

// querySelector => looks for items based on CSS selectors => this is basicly either the id or the class. <code :id="id" v-html="highlightedCode"></code>
const header = document.querySelector('h2');      // Returns only the first <h2> element, that is in the currently rendered HTML document
const el = document.querySelector(targetSelector_id); // Returns element with specific id currently rendered in the DOM.
If the element is <code id="code1" class='code2'></code>, then we can look for it using:
  document.querySelector('#code1'); 
  document.querySelector('.code2');

  tappedElement = event.target;
  tappedElement.closest('.mappopup-handle') // It walks up the DOM tree, starting from tappedElement, and returns the first ancestor that matches the selector.
                                            // The tap must be inside .mappopup-handle or its children to match.

// getElementById => only the Id selector as input.
<div id="myId" class="myClass"></div>
document.getElementById('myId'); 

  // if el = <div><b>Hello</b> <i>world</i></div>, then:
  el.innerText => Hello World
  el.innerHTML => "<b>Hello</b> <i>world</i>"

const headers = document.querySelectorAll('h2');  // Returns a NodeList of all <h2> elements, that is in the current DOM
 // if <h2>Hello</h2> => header.innerText === "Hello"

// Adding event listeners:
document.addEventListener("DOMContentLoaded", function());
document.body.addEventListener('click', el.clickOutsideEvent);
marker.getElement().addEventListener('mouseenter', () => { isVisible=true });

button.addEventListener('click', function()); // you can add event listener to whatever body
window.addEventListener('scroll', updateTooltipPosition);
window.addEventListener('resize', updateTooltipPosition); // Resizing of browser window, zooming, screen orientation change

root.value?.addEventListener('next-step', nextStep); // If root.value is not null or undefined, then call addEventListener. If root.value == null then dont call it.
  // If someone dispatches 'next-step' (DOM event) on this DOM element, then run the nextStep() function.

const img = new Image(); // built-in JavaScript constructor from the browser’s DOM API
const img = document.createElement('img'); // is the same as programmatically (and not on the template written) creating an HTML tag
const container = document.createElement('div'); // basicly like doing <div></div>

createApp({ // Like doing: createApp(App).mount('#app');
  render: () => h(TourTooltip, { tour }) // When this app renders, create a <TourTooltip> component, and pass it the tour prop
}).mount(container); // Render this mini Vue app into the given container element.
```
===============================================================================================================
**Javascript Array**

1) Push (a json line) to a list:
    this.items.push({message:"", id:this.nextID})

2) Lambda - Functions on Lists:
  2.0) Labda Function definition: (param_1, ...) => { console.log(item.value); // Body of function}
  2.1) Delete from List:
      this.items = this.items.filter(item => item.id !== id)
  2.2) Filter:
      <div v-for="assignment in assignments.filter(a => a.complete)" // assignments: [{complete: false, ...}] 
  2.3) Find:
      const found = options.find((opt) => opt.id === item.id);
  2.4) Map - Transform:
      const labels = selectedValue.map((item) => item.name);
      const labels = selectedValue.map((item) => {return item.name}); // With { ... } you start a function block.
  2.5) ForEach:
      tours.value.forEach(tour => {console.log(tour.id)});

4) Length:
    assignments.length === 0

5) ...new Set([]). The spread operator (...) unpacks the Set values back into a normal array:
    [...new Set(['math', 'science', 'math'])] // → ['math', 'science']

5.5)
  const tours = computed(() =>
    geoData.value.features.map(f => ({  // geoData is an array of jsons with field "properties" that has a JSON within it
      ...f.properties,                  // tours is an array of jsons (the json that was in properties)              
    }))
  );

5.7) ... is spreading operator:
const properties = { tour };
tour =   {
    "id": 0,
    "title": "Lisbon: Stories from the Old Town",
}

const properties = { ...tour };
...tour =   
    "id": 0,
    "title": "Lisbon: Stories from the Old Town",

Αρα το properties θα ειναι => properties = {    
    "id": 0,
    "title": "Lisbon: Stories from the Old Town",
  }

6) labels.join(', '); => if labels = ["Apple", "Banana", "Cherry"], then "Apple, Banana, Cherry".

===============================================================================================================
**Fetch API**

```javascript
1.
async function getData() {
  const url = "https://example.org/products.json";
  try {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

2.
const response = await fetch(`${url}/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});

3. fetch('http://localhost:3001/assignments') // Non Blocking – it starts the request, then immediately moves to the next code line after the request.
                                              // Without await, the data will arrive: 1) when the network response arrives 
                                              // 2) the currently running synchronous code (the one that started running since it is non blocking) to end => JavaScript is single Threaded
    .then('responce => response.json()')  // out of the responce get the JSON
    .then(data => {console.log(data)});   // what to do with the data

4. await fetch('http://localhost:5000/tours') // Blocking, it pauses execution until the Promise resolves.
    .then(response => response.json())
    .then(data => {
        tours.value = data; 
  });

3.
  npm install @vueuse/core
  import { useFetch } from '@vueuse/core'
  const { data, error } = await useFetch('./db.geojson')

4. Run Fetches in parallel (Array of fetches):
  const [useCostumPin, useCostumCluster1, useCostumCluster2] = await Promise.all([
      loadAndAddImage(map, 'custom-pin', pin_image),
      loadAndAddImage(map, 'custom-cluster-1', cluster_image_1),
      loadAndAddImage(map, 'custom-cluster-2', cluster_image_2),
  ]);
```

===============================================================================================================
**Axios** // works in the browser
1. npm install axios
2. import axios from "axios" , or include it in index.html: <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
4. Use axios with conveience methods:

  - axios.get('http://localhost:3001/assignments').then(res => console.log(res.data))

  - axios.get('http://localhost:3001/assignments')
        .then(response => {this.assignments = response.data;})
        .catch(error => {console.error('Error fetching assignments:', error);});

  - axios.post('http://localhost:3001/assignments', {name: 'Item A', surname: 'B'}) // only one objected at a post request is expected by axios. We omit id, it is autoincremented by   
                                                                                    // the JSON server
      .then(() => console.log('POST'))
      .catch(error => console.error('POST failed', error));

  - Update:
    - All data with put:
        - axios.put('http://localhost:3001/assignments/3', { id: '3', name: 'Item A', surname: 'B'}) // the id of the object is in the id. Replaces the whole item with a new item.
            .then(() => console.log('PUT'))
    - Some data with patch:
        - axios.patch('http://localhost:3001/assignments/3', { surname: 'B'}) // 
            .then(() => console.log('PUT'))
    - Delete:
        - axios.delete('http://localhost:3001/assignments/3')

3. 
const api = axios.create({
  baseURL: `http://localhost:3001/assignments`
})

4.
  axios({
    methods: 'get',
    url:'http://localhost:3001/assignments',
    params: { // the same us just doing http://localhost:3001/assignments?_limit=5',
      _limit: 5
    }
  }).then(response => console.log(response.data))

===============================================================================================================
**LocalStorage**

1) Get from Storage (JSON parse: from String to JSON):
const stored = localStorage.getItem('storedTasks');
items: stored ? JSON.parse(stored) : [{ message: "", id: 0 }],
=> function read(key) {return JSON.parse(localStorage.getItem(key))}

2) Set to Storage (JSON stringify: from JSON to String):
localStorage.setItem('storedTasks', JSON.stringify(this.items));
=> function write(key, data) {localStorage.setItem(key, JSON.stringify(data))}

3)
import {ref, watch} from "vue";
let food = ref(localStorage.getItem('food'));
watch(food, (val) => {      // first argument is a ref, it is reactive
  write('food', val); // whenever food changes to val write val
},
  { immediate: true } // the watcher runs immediatly on mount. This is a shortcut to doing this: onMounted(() => {write('food', val);});
);

or watch(data, write) => whenever data changes then execute function write (function write() {...})

or:
watch(
  () => props.modelValue,   // first argument can also be a getter, since props.modelValueisnt isnt reactive
  (newVal) => {
    localValue.value = newVal;
  },
  { immediate: true }
);

or: 
import { toRef } from 'vue';
const tourRef  = toRef(props, 'tour')
watch(
  tourRef,   // first argument can also be a getter, since props.modelValueisnt isnt reactive
  (newVal) => {
    localValue.value = newVal;
  },
  { immediate: true }
);

===============================================================================================================
**Getters Explained**
debounce(updateGeoData());            // pass whatever updateGeoData returns to debounce
debounce(updateGeoData);              // passing a reference to that function.
debounce(() => { updateGeoData(); }); // passing an anonymous arrow function

===============================================================================================================
**JSON** // JSON is of type object

- this.books = (json.items || []).slice(this.index, this.index + this.divsPerPage);

===============================================================================================================
**Strings** 
text.toLowerCase() // converts to lower case

text.includes(lowerSearch) // const text = "Hello World"; text.includes("Hello") => True, text.includes("world") => True, text.includes("o W") => True

===============================================================================================================
**Examples**

- https://www.googleapis.com/books/v1/volumes?q={search terms}
- GET https://www.googleapis.com/books/v1/users/userId/bookshelves/shelf


===============================================================================================================
**Theory**

1) DOM stands for Document Object Model, The DOM is a live tree-like structure representing the page’s content

===============================================================================================================
**Pop ups**

1. alert("You have an error")
2. npm install sweetalert --save-dev => Use it with: import swal from 'sweetalert'; swal('Success', message, 'success') (instead of success it could be alert ...)

===============================================================================================================
**Misc**
1. ?? is the nullish coalescing operator. It returns the first value that is not null or undefined
  let name = null ?? 'Default';      // → "Default"
  let name = undefined ?? 'Default'; // → "Default"
  let found?.name ?? item.name ?? 'Unknown'; // if found?.name undefined go to item.name, if undefined, go to 'Unknown'.

2. ? is optional chaining for safety, in case found is not null or undefined.
  found?.name => will go to name 
  
2.5) This is also used when we do: isArray ? !!this.checkedValues.find((item) => item.id === option.id):false // return false if not Array
  The first ! converts the value to boolean and negates it.
  The second ! negates it again, so it just converts the value to a boolean but preserves its truthiness 
    so !!this.checkedValues.find((item) => item.id === option.id) doesnt return an Object but true if the Object exists. 

