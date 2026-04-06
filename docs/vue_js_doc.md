**Vue.js Project Setup Notes**

**Info**
- Uses Client Side Rendering (CSR)

- Hot Module Replacement => doesnt need to refresh to update changes. 
- Full page refreshes still happen when you are doing <a href="...">. No refreshing is done when using Router.

- Single File Components => One File has only one <template>, <script> and <style>

=========================================================================
**npm Commands**

```bash
# Setup a vite project:
npm create vue@latest vue_try # npm => Node Package Manager, means      you  project has package.json and jsconfig.json
# or: <script src="https://unpkg.com/vue@3"></script> => This is how you include Vue directly in the browser (html) using a <script> tag

npm install # This installs everything listed in package.json, meaning the dependencies that are annotated in the project

# Specific package:
npm install vue-library
npm install git+https://github.com/cliomusetours/vue-library.git
npm install git@github.com:cliomusetours/vue-library.git

npm uninstall vue-library

npm update vue-library # so you dont have to do multiple installs on the package you can update a specific package

npm run dev # Run server (localhost), dont "Go Live". Its the same thing as doing "npm run start" it depends on what you have written in the scripts section in package.json
  or npx serve or npx vite or npx serve -l 5000
- Run backend and frontend concurently / in the same command:
  1) npm install --save-dev concurrently
  2) "dev": "nuxt dev --host 0.0.0.0" // use this to accept network access as well: "http://192.168.217.158:3000/""
  3)
    "scripts": {
      "dev": "concurrently \"npm run nuxt\" \"npm run api\"",
      "nuxt": "nuxt dev",
      "api": "json-server db.json -p 5000"
    }
npm i vue-router # i => install

# or:
npm init vue@latest # asks you for the project name directly 

npm install pinia

npm install -D sass-embedded

npm install mapbox-gl-animated-popup => "mapbox-gl-animated-popup": "^0.4.0"


=========================================================================
# Make JSON server:
npm install json-server --save-dev
npx json-server db.json -p 3001 # different from frontend port

# Run backend and frontend at the same time (Right it in package.json):
"scripts": {
  "start": "npx serve & npx json-server db.json -p 3001"
} => Execute them using: npm run start (name of the script)

=========================================================================
Start Vue:
let app = {...}
or define App.vue:

Vue.createApp(App).mount('#app');

=========================================================================
**Defining a single component in a structure**
components: { => this is like defining app-button.vue but in a single file multiple components
    'app-button': {
        template: `
            <button class="bg-gray-200 hover:bg-gray-400 border rounded px-5 py-2 disabled:cursor-not-allowed" :disabled="processing">
                <slot /> // variable ... is replaced by Submit: <app-button>Submit</app-button> (Submit replaces whatever is in the slot)
            </button>
        `,
            data() {
          return {
              processing: false
            };
        }
    },
```

===============================================================================================================
**Change ports**

server: {  # inside the vite.config.js
  port: 3000
} 

===============================================================================================================
**Loops**

1. <div v-for="item in items" :key="item.id"> // key is an attribute of items, and is used to fix the iteration of item.id
  // it just renders from existing data, not like a traditional for loop that can run logic step by step. 
</div> 

2. <li v-for="assignment in assignments" :key="assignment.id"> ... </li>

===============================================================================================================
**Conditional Rendering**
- <section v-show="completedAssignments.length" class="mt-8"> // does render it in the DOM but sets style="display: none;".
- <section v-if="completedAssignments.length" class="mt-8">   // doesnt render it in the DOM. if length is 0, then it outputs false
- <div v-if="hasData">Data loaded</div> // with v-else. Vue expects v-else to immediately follow a v-if (or v-else-if) block — as siblings in the template with no gaps.
  <div v-else-if="isData">is the Data</div>
  <div v-else>No data</div>
  
===============================================================================================================
**Events**

1. <button @click="say(name)">Search</button>  // shortcut to v-on: @click="say(name)" == v-on:click="say(name)"

2. <textarea v-model="item.message" :ref="'textarea_' + item.id" @input="resize($event)"/> // when inputing or deleting a character =>  
                                                                                              input event
    => event refers to the element text area
    => use el = event.target to get this element
   <input v-model="text" placeholder="Add text ...">

3.  <form @submit.prevent="addAssignment()"> // prevent the website from loading (instead of using e.preventDefault();)
        <input v-model="assignment_to_be_added" placeholder="Add assignment ...">
        <button type="submit">Add</button>
    </form>

4. Emits definitions: If you dont define emits, you get warnings
    emits: [
      'update:modelValue', 
      'selected',          
      'selectedLabel']
    Create a costum event: this.$emit('add', this.newAssignment) // child (can also take less than 2 arguments: 
    @click="$emit('toggle'), just the name of the costume event)
    Listen to it: <assignment-create @add="do_add">            // parent
                  do_add(name) { // name = this.newAssignment, the calling variable
                      this.assignments.push({
                          name: name, completed: false});}
              => <assignment-tags :initial-tags="assignments.map()"
        OR: <button @click="$emit('change', tag)" // costum event with event object being "tag" and its name being change
            <assignment-tags @change="currentTag = $event">` ($event here is tag, magic event variable)

5.  @keydown => When key is first pressed, only if the imput component is focused on ... for example: 
      -> the tab key: @keydown.tab
      -> the enter key: @keydown.enter
    @keydown.tab.prevent is the same as e.preventDefault()
    @keyup => When key is released

6.  @mouseover="showTooltip = true"   // if the mouse is over the element do that
    @mouseout="showTooltip = false"
    same events: "mouseenter" and "mouseleave"
    
7.  @change: <input type="checkbox" :checked="isChecked" @change="..." /> // when clicking rhe checkbox "change" gets triggered
    // catch it with event.target.checked. :checked controls if its checked or not.

8.  event.stopPropagation() // The event is triggered on the element where the touch actually occurred.
                            // Then it bubbles up through its parent elements — from the innermost to the outermost.
                            // Each parent along the way has a chance to respond to that event
    event.preventDefault()  // Prevents the default browser behavior for this event.

9.  @touchstart="onTouchStart"
    @touchend="onTouchEnd" 

===============================================================================================================
**Elements** 

1. <label for="myCheckbox">     // for is a label specific attribute. Associates label to form control (like input)
      <input type="checkbox" id="myCheckbox" /> // id uniquely identifies the <input> (global attribute)
      <span>I am the label</span> 
    </label>

2. <input type="file" accept="image/*" ..." />  // accept any kind of image ("image/*" is a MIME type pattern.)
                                                // provides a button (click event) to access the file system, but its ugly.
  Costum button solution:
  <input type="file" accept="image/*" style="display: none" ref="imageInput" @change="handleFileChange" />
  <Button @click="openFileDialog" />
  const openFileDialog = () => {imageInput.value.click();}; // triggers file picker

3. By default <input type="text">
4. <input type="password" name="MyPassword" value="MySecret123">  // it wont be shown since its a password (dots for each character). 
                                                                  // the name references the value, like so: MyPassword=MySecret123


===============================================================================================================
**Modals / Popups**
  <div v-if="updateForm" class="updateFormOverlay" @click="closeUpdate()">
    <div class="updateFormDiv" @click.stop>    
  .updateFormOverlay {
    background-color: gray;
    color: gray;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .updateFormDiv {
    background-color: white;
    width: 30%;
    height: 30%;
    padding: 7px;
  }

===============================================================================================================
**Transition**
  <Transition
    enter-from-class="opacity-0 scale-125" enter-to-class="opacity-100 scale-100" enter-active-class="transition duration-300"
      // when the modal pops up, go from this class to this class (its written in tailwind)
    leave-active-class="transition duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-125"
      // when the modal closes
  >
  or
  <Transition
    enter-from="opacity-0 scale-125" enter-active="transition: opacity 0.2s;"
      // when the modal pops up, go from this class to this class (its written in tailwind)
    leave-active="transition: opacity 0.2s" leave-to="opacity-0 scale-125"
      // when the modal closes
  >

===============================================================================================================
**Teleport**
  <Teleport to="body"> // render it inside the body. You can teleport to id: <Teleport to="#hello"> (<div id="hello">)
    ... (Modal) ...
  </Teleport>

===============================================================================================================
**Popover**
@popperjs/core => official positioning engine, intelligently calculates where an element should appear relative to another element
import { createPopper } from "@popperjs/core";
const popperInstance = createPopper(referenceElement, floatingElement, {
  placement: 'bottom', // where it should appear even if not possible. 'bottom-start' means Aligned to the left/beginning
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8], // offset: [skid (horizontal shift), distance (vertical gap)]
      },
    },
  ],
});

===============================================================================================================
**Data Binding**

1. Text Interpolation / Text content (display a variable as a text):
  - <span>Message: {{ msg }}</span>

2. Attribute Bindings:
  - <div v-bind:id="dynamicId"></div>
  - <div :id="dynamicId"></div> // shortcut to v-bind: => :
  - <input v-model="searchText" /> // Same as:
      <input :value="searchText" @input="searchText = $event.target.value"/> // $event is a special Vue variable that refers to the native DOM event object (input event object)

3. Dynamic ref binding:
  - <textarea :ref="'textarea_' + item.id"></textarea> // can access this specific textarea with => this.$refs["textarea_2"] 
    const stored = localStorage.getItem('storedTasks');
    return {
      nextID: 1,
      items: stored ? JSON.parse(stored) : [{ message: "", id: 0 }],
    };

4. Class Binding:
- class="option" :class="{ active: selected === 'option3' }" => class="option active", if selected === 'option3'
    => label this as: .option.active in scss => '=' is assignment, '===' is comparison 
- :class="{ 'icon-label--border-circle': props.language }" // apply class if props.language === true

- <button v-on:click="changeColors()" :class="ff ? 'c2' : 'c1'">Click Me</button>
- <button v-on:click="changeColors()" :class="{ c2: ff, c1: !ff }">Click Me</button>
- :class="[buttonClass, { 'button--text-center': textPosition === 'center' }]" => you are getting both the buttonClass and the 'button--text-center' class

- .button__red:hover {background-color: rgba(213, 69, 82, 0.7);}  // pseudo classes :hover and :active, activate when hovering or DURING clicking. Handled only by SCSS.
  .button__red:active {background-color: var(--primary-color--deep-garnet);}
- <h2 :style="{ paddingBottom: isMobile() && !isExpanded ? '1rem' : '0rem' }">{{ title }}</h2>

===============================================================================================================
**Lifecycle Methods**

- OnMounted:  // only then are the elements fully rendered in the DOM (it triggers after the elements have been loaded in the DOM)
              // runs client side, the elements already exist
      mounted() {setTimeout(() => {this.greeting = 'Changed';}, 3000);} // in 3000ms this will happen

      import { onMounted } from 'vue'; // composition API
      let intervalId;               // keep reference so we can clear it
      onMounted(() => {intervalId = setInterval(() => {
                        console.log(text.value);
                      }, 1000);});

- created() {...}

===============================================================================================================
**Importing / Exporting Components**

<script>
import Navbar from './components/Navbar.vue'
export default {
  components: {
    Navbar
  }
}
</script>

import about from '../views/about.vue' => export default
import {about} from '../views/about.vue' => needs to explicitly export about, like export const about

===============================================================================================================
**Routing**

1.  go_home() {
        this.$router.push('/'); // this.$router has been added by View or plugin, isnt our component, convention $.
    }
    1.5 => $route.path => the current path (anything after http://localhost:3000/)

- With composition API:
  import { useRouter, useRoute } from 'vue-router';
  const router = useRouter();
  function goToPage(path) {router.push(path);}

2. Use it:
  import './assets/main.css'
  import { createApp } from 'vue'
  import { createPinia } from "pinia";
  import App from './App.vue'
  import router from './router'

  const app = createApp(App)
  app.use(router)
  app.use(createPinia())
  app.mount('#app')

3. <a href="/about">About Page</a> => <RouterLink to="/about">About Page</RouterLink> // (import RouterLink)

4. <a href="#header-My-Heading">My Heading</a>  // When appending with #: Scroll the page to the element that has id="header-My-Heading".
                                                // doesnt define a new Route just appends to the current Route
                                                // only one #hash is shown in the URL => replacement of #

===============================================================================================================
**Props** 
props: {
  type:{                // Name of the prop, its a variable that can be used inside the vue component, but set from top level (builds a 
                            parent child hierarchy)
    type: String,       // Variable type
    default: 'primary', // Default value it will take if nothing is set
    required: true,     // the component must be given a type prop
  },
  align: {
    type: String,
    default: 'bottom',
    validator: (value) => ['bottom', 'top', 'right'].includes(value), // basicly makes an enum. Doesnt enforce it just shows a warning
  },
}
<app-button :align="bottom">Submit</app-button> //=> select the processing prop

- id="1" passes a string with value "1" (always a string in HTML).
- :id="1" passes a number with value 1 (JavaScript number)., to pass a string you would need=> :id="'1'" 

==================================================
**V-modeling on Props / Events** 

Generally: parent -> child via props, child -> parent via $emit. We can automate this using v-model:
- Child: 
  <button
      @click="$emit('update:modelValue', tag)" // update + modelValue => refers to parents v-model. Tag is the payload that is going to be necessary and it is necessary
      v-for="tag in tags" 
      class="border rounded px-1 py-px text-xs"
  >{{ tag }}</button>  
  props: {
    modelValue: String
  }

- Parent:
<assignment-list v-model="currentTag">  // currentTag and tag is synced. 
                                        // There is also a second sync between currentTag and its local value

"modelValue" is not needed to be the event:
Child: @click="$emit('update:isChecked', event.target.checked)" // establish a sync between checked and event.target.checked
Parent: <assignment-list v-model:isChecked="checked">           // isChecked prop is the same as "checked"

const isVisible = computed({
   get: ()  => props.isVisible,
   set: val => emit('update:isVisible', val)   // <‑‑ emits to parent
});

==================================================
**Props With Composition API** 
// Child:
<script setup>
const props = defineProps({ // you can use this either like <img :src="props.tour.images?.cover" /> or <img :src="tour.value.images?.cover" />
        hasHeader: {
            type: Boolean,
            default: false
        },
        hasFooter: {
            type: Boolean,
            default: false
        },
        tour: {
          type: Object
        }});
let emit = defineEmits(['update:modelValue']); // Used to declare custom events that your component emits.
<template @keyup="emit('update:modelValue', $event.target.value)">
</script>

//Parent:
<TabbableTextarea v-model:"comment" />
  
===============================================================================================================
**Components**
import AssignmentList from "./AssignmentList.js";
export default {
    components: { AssignmentList } ...

AssignmentList.js => translate to => <assignment-list></assignment-list>

Documentation of Components:
  - Props
  - Slots
  - Events

===============================================================================================================
**Slots**
1. <slot /> // parent completes slot by: <child> Something </child>. Self closing slot
            // <slot> AAAA </slot>, identical, but you can add fallback content, if the slot isnt filled 
2. v-slots:
Child: 
    <h2 v-if="$slots.heading"><slot name="heading" /></h2>
Parent:
    <child>
      <template v-slot:heading> // in short <template #heading>
          Something
      </template>
    </child>
  => Whatever isnt defined in a template is going to go to the default slot: <slot />

3. Proping Slots:
  // Parent:
  <template #default="{ item, index }"> // these are passing to the slot even if it doesnt seem directly linked.
          ({{index}}) {{ item.name }}
  </template>
  // Child: 
  <slot :item="item" :index="idx" />


===============================================================================================================
**Options API**
export default {
  name: 'ComponentName',
  props: { ... },
  data() { return { ... } },
  computed: { ... },    // A dynamic value, based on other values. But unlike methods, it's cached until its dependencies change (value based on other data).
                        // AuthorNames is purely derived from props.tour, and there's no side-effect. That's exactly what computed properties are meant for.
  methods: { ... },
  watch: { ... },
  mounted() { ... },
}
i.e.:
computed: { // is triggered whenever the list of assignments changes.
    filters() { 
        return {
            inProgress: this.assignments.filter(assignment => ! assignment.complete),
            completed: this.assignments.filter(assignment => assignment.complete)
        };
    }
},

===============================================================================================================
**Composition API** // Bundles Reactivity API, Lifecyle Hooks (different name)
// options API with composition API
<script>
import TheWelcome from "@/components/TheWelcome.vue"
import {onMounted, ref, reactive} from "vue"
export default {
  components: {TheWelcome}, // need to mention components, this part is still options API
  onMounted(() => {...});
  setup(props, {emit}) {  // make message a Reactive variable using ref. This part is the compositions API portion
                          // you need these parameters when you are using props and using emits
    let message = ref("Hello World"); // change the value using message.value = '...'
    (let message = reactive({name: "Hello World"});) // change the value using message.name = '...', only works with objects (jsons)
    return {  
      messeage,
    };
  }
}
</script>
(export default defineComponent({ // strongly type, compiler is enable here and it tells you if its wrong beforehand
  // your component logic here
});)

============================================
// pure composition API ("this" isnt allowed)
<script setup> // <script setup lang="ts">	=> That explicitly makes the script TypeScript, not JavaScript.
import TheWelcome from "@/components/TheWelcome.vue"
import {onMounted, ref} from "vue"
  components: {TheWelcome},
  onMounted(() => {...});
  let message_1 = ref("Hello World"); // All you need is this to state thatmessage is reactable
  let message_2 = ref('');  // Hello World is just an initialization this is supposed to be reactive either way
                            // let is used when you plan to reassign the variable (to another ref / function)
  const showPopover = ref(false); // const == reference never changes, you can mutate their .value, but not the reference to the ref 
                                  // itself never changes
  const code = "import { Checkbox } from 'vue-library';"; // is a variable that isnt expected to change during runtime, during normal UI 
                                                          // handling from the user
  function write(key, value) {
    message_2.value = value   // change value of meassage_2. .value is only required here not in template.
    localStorage.setItem(key, value)
  }
  const optionSelected = (payload) => {
      optionSelectedValue.value = payload;
  };
  defineProps({
      name: {
          default: '',
          type: String
      }
  });
  const emit = defineEmits(['left-action', 'right-action', 'clickedExit']);
  const authorNames = computed(() => {
    const author = props.tour?.author;
    if(Array.isArray(author)) {
      return author.map(a => a.name).join(', ');
    } else {
      return author.name
    }
  });

</script>

===============================================================================================================
**Composables**
// Define it in composables/useFlash.js:
export function useFlash(){
  function flash(message){
    return swal('Success', message, 'success');
  }
  return { flash };
}
// Use it:
<script setup>
  import {useFlash} from '@/composables/useFlash'; // @ = './src'
  let {flash} = useFlash();
</script>

===============================================================================================================
**Caret - TextArea**
function onTabPress(e) {
  let textarea = e.target;
  let val = textarea.value, start = textarea.selectionStart, end = textarea.selectionEnd;
  textarea.value = val.substring(0, start) + "\t" + val.substring(end); // start and end arent the same, since there is selection
  textarea.selectionStart = textarea.selectionEnd = start + 1;  // πχ: "ab[cd]efg", start = 2, end = 4, +1 because independent from 
                                                                // length, \t is one character
}

===============================================================================================================
**Injections** // depth independent communication between child and parent
//parent:
import {provide} from "vue";
let value1 = ref('I am Hello')
provide('key1', {
  value,
  changeName: () => name.value = 'Changed' 
})

//child:
import {inject} from "vue";
let { value1, changeName } = inject('key1');
...
<button @click="changeName">

===============================================================================================================
**Directives**
// Generally directives are whatever has v-* in front of it and is inside a tag. But there are costum directives:
<script> // include the directives:
  directives: {
    'click-outside': clickOutside,
  }
</script>
<div v-click-outside="closePopover"> ... </div> // use the directives, this directive is bound to this div el (element)
                                                // binding.value === closePopover, binding.value() === closePopover() (method call)

===============================================================================================================
**Export**
- Normally: export default {.... The entire file ...} // 
- Explicit export:
  export let state = reactive({name: 'Nig', questions: []})

===============================================================================================================
**Plugins**
plugins: [ // tells component what features to include from library
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
    listPlugin
],

===============================================================================================================
**Pinia**
// In counterStore.js:
import { defineStore } from "pinia";
export let useCounterStore = defineStore('counter', {
  state() { // data
    return {
      count: 0
    };
  },
  actions: { // methods
    increment() {
      if( this.count < 11){
        this.count++;

      }
    }
  }
  getters: // computed
})
// in Whatever component:
import {useCounterStore} from "@/stores/counterStore.js";
let counter = useCounterStore();

===============================================================================================================
**Build-in Libraries for components**
- import FullCalendar from '@fullcalendar/vue3';  // @	NPM (Node Package Mananger) organization scope. 
        // a scope is a namespace for a group of packages. An organization in NPM is a group account that can own scoped packages.
        // @fullcalendar = the scope, vue3 = the package within that scope
  <template v-slot:eventContent="arg"> // arg is generated by calender and has arg: {timeText: '9:00am', event: { ... }, ...}
    <b>{{ arg.timeText }}</b>
    <slot name="calendar-cell-data" :data="arg"></slot>
  </template>
- import { DatePicker } from 'v-calendar';

===============================================================================================================
**Misc**
- await nextTick(); // when you change a reactive value in Vue, it doesnt change instantly but is scheduled to the next Tick. 

