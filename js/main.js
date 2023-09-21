const products =[
    {id:1, name:"serum vit. c", precio: 5000, img:'serum.jpg' },
    {id: 2, name:"crema facial", precio:4500, img:'cremafacial.jpg'},
    {id: 3, name:"protector solar", precio:700, img:'protectorsolar.jpg'},
    {id: 4, name:"tonico facial", precio:6500, img:'tonicofacial.jpg'},
    {id: 5, name:"serum nocturno", precio:5000, img:'serumniacinamida.jpg'},
    {id: 6, name:"crema corporal", precio:7300, img:'cremacorporal.jpg'}
];

const cart = JSON.parse(localStorage.getItem('cart')) || [];

function crearHTML(){
    const productList = document.getElementById('product-list');
    products.forEach(({id,name,precio,img})=>{
        const listItem = document.createElement('div');
        listItem.innerHTML=`<div class="card">
        <img class="imgtienda" src="../imagenes/${img}" alt="${name}">
        <h2>${name}</h2>
        <p>$${precio.toFixed(2)}</p>
        <button class="add-button" data-id="${id}">Agregar</button>
    </div>`;

        productList.appendChild(listItem);
    });

    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach((button)=>{
        button.addEventListener('click', (e)=>{
            p.innerText='';
            const productId = parseInt(e.target.getAttribute('data-id'));
            const selectedProduct = products.find(product => product.id === productId);
            selectedProduct && cart.push(selectedProduct) && updateCart();
            Toastify({
                text: "Se agrego un producto al carrito.",
                className: "info",
                duration: 1500,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background:"rgb(122, 119, 114)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
        })
    })
}


function updateCart(){
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML='';
    let total= 0;
    cart.forEach((product, index)=>{
        const {name, precio}= product;
        const cartItem = document.createElement('li');
        cartItem.className='cart-product';
        cartItem.textContent=`${name} - $${precio.toFixed(2)}`;
        const removeButton= document.createElement('button');
        removeButton.textContent='X';
        removeButton.className='btn-remove';
        removeButton.addEventListener('click', () =>{
            cart.splice(index, 1);
            updateCart();
        });
        cartItem.appendChild(removeButton);
        cartList.appendChild(cartItem);
        total += precio;
    });
    const totalElement = document.getElementById('total');
    totalElement.textContent= total.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
}

fetch('../data/data.json')
.then(response=>response.json())
.then(datos=>{
    crearHTML(datos)
})

updateCart();

const p=document.getElementById('mensaje');
const checkoutButton= document.getElementById('checkout-button');
checkoutButton.addEventListener('click', ()=>{
    if( cart != ""){
        cart.length = 0;
        updateCart();
        setTimeout(()=>{
            Swal.fire({
                title:'Muchas gracias por tu compra!',
                text:'Te estaremos enviando un Email con los detalles.',
                width:'45rem',
            })
        }, 1500)
    }
})

const btnVaciar = document.getElementById('vaciar-button')
btnVaciar.addEventListener('click',()=>{
    if(cart !=""){
        cart.splice('cart');
        updateCart();
        localStorage.removeItem('cart');
        p.innerText='Carrito vacio';
    }
});
