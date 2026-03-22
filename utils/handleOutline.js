// Remove or restore the outline style of the internal <input> depending on whether the user is interacting with the element via mouse or keyboard (tab)
// Input element doesnt have a focus indicator by default when hitting tab

// When Clicked Component has input component as a child (the focus indicator shouldnt show)
export function hideOutline(event) {
    const el = event.currentTarget; 
    if (el) el.style.outline = 'none';
    const inputChild = el.querySelector('input');
    if (inputChild) {
      inputChild.style.outline = 'none';
    }
}

export function resetOutline(event) {
    const el = event.currentTarget;
    if (el) el.style.outline = '';
    const inputChild = el.querySelector('input');
    if (inputChild) {
      inputChild.style.outline = '';
    }
}

// When Hitting Tab, restore all outlines for every input component in the DOM
export function resetAllInputOutlines() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.style.outline = '';
    });
}