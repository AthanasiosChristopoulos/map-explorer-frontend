**Theory**
- Typography: Everything related to text styling, like font family ...
- Spacing: Padding, Margin, ... 

===============================================================================================================
**CSS Selectors** 
```css
* { ... }             /* Every element */
.navbar { ... }       /* Every element with class "navbar" */
#homeButtons { ... }  /* The element with ID "homeButtons" */
.NavDivs2 a, .NavDivs2 span /* Inside of NavDivs2 affect a and span this way*/
```
===============================================================================================================
**Ways to apply**
1. Withing the class: <button class="bg-gray-200 hover:bg-gray-400 border rounded px-5 py-2 disabled:cursor-not-allowed" :disabled="processing"> 
                        // apply cursor-not-allowed if disabled true

2. Conditional Attributes:
        <button :class="{
                'border rounded px-5 py-2 disabled:cursor-not-allowed': true,   // Always add those attributes
                'bg-blue-600 hover:bg-blue-700': type === 'primary',            // Add attributes only if type === 'primary'
                'bg-purple-200 hover:bg-purple-400': type === 'secondary',
                'is-loading': processing // Enable / Disable this costum class
                }" 
                :disabled="processing">

3. in <style> .apply-button {bg-gray-200} </style>

===============================================================================================================
**Special Selectors**

``` css
1) @media (min-width: 1024px) { /*This sets a grid layout for the #app element only on screens wider than 1024px.*/ 
        #app {display: grid;}
    }
2) body { /* Targets the entire <body> HTML element, in the same way we have <a> (link tags) */
        display: flex;
        background-color: #242423;
    } 
```
===============================================================================================================
**Units**
1. px: Pixels - fixed size
2. vw - viewport width: // respectively vh - viewport height
    80vw = 80% of the width of the browser window, If your screen is 1000px wide, 80vw = 800px.
3. rem - root em - The font size of the root html element:
    1 rem => 16px;

===============================================================================================================
**CSS Properties**

```css
margin: 15px;           /* Outer spacing: top, right, bottom, left */
margin: 2rem 3rem 0.5rem 3rem;  /* Outer spacing: top, right, bottom, left */
padding: 15px;          /* Inner spacing: top, right, bottom, left */
padding: 0.8rem 6rem;   /* padding: [TOP & BOTTOM] [LEFT & RIGHT]; */
padding: 2rem 3rem 0.5rem 3rem; /* padding: top right bottom left; */

font-family: 'Commissioner', sans-serif; //'Commissioner' is a costum font. If it fails to load, load fallback font sans-serif.
font-size: 80px;
letter-spacing: 0.05rem;
color: #333;
color: inherit; // whatever color is specified in the above element

background-color: #d4315f;
background: #fff;

text-decoration: none;

opacity: 0; // invinsible, opacity: 0.5; // 50% transparent, opacity: 1; // Fully opaque 
scale: 125; // increase size by 25%

cursor: default;
cursor: pointer;    /* For clickable elements */
cursor: grap;       /* For grabbable elements */
cursor-not-allowed;

border: 1px;
border: 3px solid black;  /* Visible solid black border */
border-radius: 7px;
border-radius: 1.875rem 1.875rem 0 0; /* border-radius: top-left top-right bottom-right bottom-left; */

box-shadow: 0px 10px 49px 0px rgba(160, 44, 44, 0.13)
    0px: horizontal offset => no horizontal offset, 10px: vertical offset, 49px: how soft the shadow is, 0px: how much the shadow expands

box-sizing: border-box;  /* Border stays inside the defined width and height */
box-sizing: content-box; /* makes the width and height apply only to the content area, and the border sits outside that content. */

text-decoration: underline;
text-decoration: none;

transition: all 0.5s ease-in-out; /* whatever change happens slowly*/
transition: opacity 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02);  /* Transition to 100% opacity in 0.2 seconds, with a specific curve */
```
===============================================================================================================
**Positioning & Layout**

```css
display: flex; // following need display flex: align-items, justify-content, flex-direction
flex-direction: row; // This determines the main axis (here row) and the cross axis (here column)
justify-content: center; // main axis alignment => align horizontally
align-items: center;   // (align-self same thing) cross axis alignment => align vertically

flex-wrap: wrap // wrap allows items to move to the next line if there isn't enough space on one row.

align-items: center;
align-items: stretch;   // Default, it means items will stretch horizontally.
align-items: flex-start; // flex-start to explicitly align items to the start of the cross axis (top or left)

text-align: left; // Default
text-align: center;

display: grid; // class="grid gap-3" in tailwind
gap: 3rem; 
place-items: center;

width: 400px; //max-width: 100px;
height: 40px;

position: relative // just becomes positioning context for any of its absolutely positioned children. But stays in the normal document flow.

position: absolute; // It’s positioned relative to the nearest parent that has position: relative or absolute or fixed
top: 47px; 
right: 30px;

// Takes up the entire screen:
position: fixed; // means that is positioned relative to browser window
top: 0;
left: 0;
width: 100%;
height: 100%;

100vw and 100vh are viewport units:
width: 100vw;   // 1vw = 1 % of the browser window’s width (however offsets like margin can still influence it)
height: 100vh;  // 1vh = 1 % of the browser window’s height
width: 100%;   // for absolute component, calculated from height and width of the containing block (with position: relative) 
height: 100%;  

overflow controls both the horizontal (overflow-x) and vertical (overflow-y) overflow behavior at the same time:
overflow-y controls what happens when the vertical content (y-axis) of a container exceeds its height, values:  
overflow-y: visible; // Content is not clipped, even if it overflows.
overflow-y: auto;   // is clipped but also scrollwhell, which appears only if there is overflow
overflow-y: scroll;   // Content is clipped, but a scrollbar is always shown (even if not needed).
overflow-y: hidden;   // is clipped without also scrollwhell

flex-shrink: 1; /* If the container doesn't have enough space, I'm allowed to shrink to take up less space. */  
flex-shrink: 0; /* prevents it from being collapsed */

width: fit-content; // tells the element to shrink or grow to fit its content
width: -webkit-fill-available; // Let the element take up all the available horizontal space inside its parent,

to set: 
position: absolute;
bottom: 0; 
right: 0;
   // the parent component needs to have defined width anxd height, because otherwise: parents width collapses to 0 since 
   // absolutely‑positioned children don’t contribute to flex‑box size.
                
// Priority which elements are topper that the other (the z-Plane)
z-index: 10;

overflow: hidden; /* prevent unwanted scrolls */

// Object-fit is for the child component, it is the object that fits inside a div
object-fit: contain;    // Not cropped, maintains aspect-ratio, leaves empty space 
object-fit: cover;      // Is cropped, maintains aspect-ratio, Fills the container completely => use width: 100% and height: 100%
width: 100%; height: 100%; /* fill the parent’s width and height */
object-fit: cover; /* keep ratio, crop excess (after width: 100%; height: 100%; has filled the parent) */

aspect-ratio: 0.5 /* aspect-ratio = width / height */
/* Flex Box */
flex: 1; /* take remaining horizontal space */
flex-grow: 1; /* fill remaining vertical space */

left: 50%; /* Go to 50% of the containing element (so to the center) */
transform: translateX(-50%); /* shifts the element leftward by 50% of its OWN width */
translateY(100%) /* Push the element down 100% of its height */
```

tooltipContainer.value.getBoundingClientRect(); // get the size and position of the component, relative to the viewport (visible area of a web page)
===============================================================================================================
**PseudoClasses**

.circle:hover { // hover is the pseudoclass meaning not really a defined class. change the object while hovering 
    background-color: greenyellow;
    transform: scale(1.2); 
}

===============================================================================================================
**Tailwind**
New Method to set class, directly pass them in the class: <section class="flex gap-8 black-400">
- gap-2 => sets a gap between items
- bg-blue-600 /* bg => background (color), 600 => intensity*/
- text-xs => text extra small
- mt-6 => margin-top: 6px;
- py-1 and px-1 (p stands for padding) (padding of 1px in the y and x Axis)
- w-[100px]

===============================================================================================================
**Misc**

1) Fit Images in their Div:
    <img :src="data.img" class="image">
    .image {
        display: block; 
        width: 100%; 
        height: 100px;
        object-fit: contain; // the image will not get distorted while adapting to the height (gets zoomed back)
    }

===============================================================================================================
**SCSS**

- .scss === Sass (Syntactically Awesome Stylesheets) files 
- a CSS preprocessor that extends standard CSS with extra features
- Variables: 
    $primary-color: #ff6600;
    body {color: $primary-color;}
- @use "base/__base-dir"; // means that whatever is on _base-dir, use it for css / styling. The root is still style.scss

===============================================================================================================
**BEM** // how you name you scss classes 
Block: The standalone entity/component
.button, .popover, .card

Element: A part of the block, connected by __ (element inside block)
.button__icon, .popover__content

Modifier: A variant or state of block/element, connected by --
.button--disabled, .popover__content--active // this is the active modifier

```css
.component {
  background-color: greenyellow;
  &__child-element {
    background-color: greenyellow;
  }
}
// Compiles to:
.component__child-element {background-color: greenyellow;}

============================================================================
.slot {...}
.slot + .slot {padding-top: 2rem;} // Adjacent sibling combinator (+). Applies in such a case:
    // <div class="slot">First</div> 
    // <div class="slot">Second</div>, this then gets padding-top, because its the adjacent sibling
```

============================================================================
// Print dimensions:
<img :src="tour.images.cover" alt="Preview not available" class="mappopup__img" ref="imgRef"/>

const { width, height } = imgRef.value.getBoundingClientRect();
console.log('Image dimensions:', width, height);

============================================================================
// SVG => a markup language called Scalable Vector Graphics. It’s used to describe 2D vector graphics in XML format

<svg width="32 // in pixels" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg // XML namespace, boilerplate for SVG">
  <circle cx="16" cy="16" r="14" fill="white" />
  <line x1="11.5" y1="11.5" x2="20.5" y2="20.5" stroke="#3E4954" stroke-width="2" stroke-linecap="round"/>
  <line x1="20.5" y1="11.5" x2="11.5" y2="20.5" stroke="#3E4954" stroke-width="2" stroke-linecap="round"/>
</svg>

============================================================================
// Spinner Implemented in CSS:
.spinner {  
    border: 5px solid var(--neutral-color--silver-sand);
    border-top: 5px solid var(--blue-accent); /* This is gives the illusion that the border-top is spinning */
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    animation: spin 1s linear infinite; // The entire div spinner is spinning. defines movement which will last 1sec.
}

@keyframes spin {
  0% {transform: rotate(0deg);}  // defines start of movement
  100% {transform: rotate(360deg);} // defines end of movement
}
============================================================================
// Vertical Line to the center:
<div style="position:absolute;top:0;bottom:0;left:50%;width:1px;background:red;"></div>
