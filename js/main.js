const products =[
    {id:1, name:"serum vit. c", precio: 5000, img:'serum.jpg' },
    {id: 2, name:"crema facial", precio:4500, img:'cremafacial.jpg'},
    {id: 2, name:"protector solar", precio:700, img:'protectorsolar.jpg'},
    {id: 3, name:"tonico facial", precio:6500, img:'tonicofacial.jpg'},
    {id: 4, name:"serum nocturno", precio:5000, img:'serumniacinamida.jpg'},
    {id: 5, name:"crema corporal", precio:7300, img:'cremacorporal.jpg'}
];

const cart = JSON.parse(localStorage.getItem('cart')) || [];

function showProducts(){
    const productList = document.getElementById('product-list');
    products.forEach((product)=>{
        const listItem = document.createElement('div');
        listItem.innerHTML=`<div class="card">
        <img class="img" src="./imagenes/${product.img}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>$${product.precio.toFixed(2)}</p>
        <button class="add-button" data-id="${product.id}">Agregar</button>
    </div>`;

        productList.appendChild(listItem);
    });

    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach((button)=>{
        button.addEventListener('click', (e)=>{
            const productId = parseInt(e.target.getAttribute('data-id'));
            const selectedProduct = products.find(product => product.id === productId);
            if(selectedProduct){
                cart.push(selectedProduct);
                updateCart();
            }
        })
    })
}

function updateCart(){
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML='';
    let total= 0;
    cart.forEach((product, index)=>{
        const cartItem = document.createElement('li');
        cartItem.textContent=`${product.name} - $${product.precio.toFixed(2)}`;
        const removeButton= document.createElement('button');
        removeButton.textContent='X';
        removeButton.addEventListener('click', () =>{
            cart.splice(index, 1);
            updateCart();
        });
        cartItem.appendChild(removeButton);
        cartList.appendChild(cartItem);
        total += product.precio;
    });
    const totalElement = document.getElementById('total');
    totalElement.textContent= total.toFixed(2);

    localStorage.setItem('cart', JSON.stringify(cart));
}

showProducts();
updateCart();

const checkoutButton= document.getElementById('checkout-button');
checkoutButton.addEventListener('click', ()=>{
    if( cart != ""){
        alert('Muchas gracias por su compra! Estaremos enviando un Email con los detalles de la compra.');
        cart.length = 0;
        updateCart();
    }else{
        alert('No se agregaron productos al carrito');
    }
})

