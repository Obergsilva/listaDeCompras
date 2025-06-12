const welcomeSection = document.getElementById('welcome-section');
const nameInput = document.getElementById('name-input');
const enterBtn = document.getElementById('enter-btn');
const welcomeMessageDisplay = document.getElementById('welcome-message');
const addItemSection = document.getElementById('add-item-section');
const newItemInput = document.getElementById('new-item-input');
const addItemBtn = document.getElementById('add-item-btn');
const shoppingList = document.getElementById('shopping-list');
const itemCountDisplay = document.getElementById('item-count');

let draggedItem = null;

function updateItemCount() {
    const checkboxes = shoppingList.querySelectorAll('.item-checkbox');
    let totalCount = checkboxes.length;
    let purchasedItems = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            purchasedItems++;
        }
    });

    itemCountDisplay.textContent = `Itens Comprados: ${purchasedItems} /${totalCount}`;

    if (totalCount > 0) {
        shoppingList.style.display = 'block';
        itemCountDisplay.style.display = 'block';
    }else {
        shoppingList.style.display = 'none';
        itemCountDisplay.style.display = 'none';
    }
    
}

function createListItem(itemNome, isChecked = false) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-item');
    listItem.setAttribute('draggable', 'true');

    listItem.innerHTML = `
 
        <span class="item-name">${itemNome}</span>
        <input type="checkbox" class="item-checkbox" ${isChecked ? 'checked' : ''}>
        <button class="remove-item">X</button>
        <span class="drag-handle">::</span>
    `;
    
    const checkbox = listItem.querySelector('.item-checkbox');
    checkbox.addEventListener('change' ,() => {
        if (checkbox.checked){
            listItem.classList.add('comprado');
        }else {
            listItem.classList.remove('comprado');
        }
    
        updateItemCount();   


    
}); 

const removeButton = listItem.querySelector('.remove-item');
 removeButton.addEventListener('click',( ) =>  {
    listItem.remove();
    updateItemCount();
 });

 listItem.addEventListener('dragstart', (e) => {
    draggedItem = listItem;
    setTimeout (() => {
        listItem.classList.add('dragging');
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
 })
 listItem.addEventListener('dragend',() => {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
 })
    return listItem;
}

addItemBtn.addEventListener('click', () => {
    const itemName = newItemInput.value.trim();
    if (itemName) {
        const newItem = createListItem(itemName);
        shoppingList.appendChild(newItem);
        newItemInput.value = '';
        updateItemCount();
    }
});

newItemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter'){
        addItemBtn.click();
    }
});

shoppingList.addEventListener('dragover' ,(e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(shoppingList, e.clientY);
    const currentItem = document.querySelector('.dragging');
    if (currentItem === null) return;
    if (afterElement == null) {
       shoppingList.appendChild(currentItem);  
    }else {
        shoppingList.insertBefore(currentItem, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.list-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
    }else {
        return closest;
    }
}, { offset: -Number.MAX_VALUE , element: null }).element;
}

enterBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        welcomeSection.style.display = 'none';
        addItemSection.style.display = 'block';
        welcomeMessageDisplay.textContent = `Bem-vindo ${name},pode iniciar sua lista de compras!`;
        welcomeMessageDisplay.style.display = 'block';
        addItemSection.style.display = 'flex';
        updateItemCount();
    }else {
        alert('Por favor digite seu nome para continuar.');
    }
});

nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        enterBtn.click();
    }
});

window.onload = () => {
    addItemSection.style.display = 'none';
    shoppingList.innerHTML = '';
    updateItemCount();
};