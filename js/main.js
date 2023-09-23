let products 
fetch('../data/data.json')
.then(response=>{
    return response.json()
})
.then(datos=>{
products=datos;
    crearHTML(datos)
})


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


function calcIds (array,id) {
    let cont = 0

    array.forEach(i => {
        i === id && cont++
    })

    return cont
} 


function updateCart(){
    const cartLocal=localStorage.getItem('cart');
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML='';
    let total= 0;
    let cartProduct=[];
    cart.forEach((product,index)=>{
        const {name, precio, cant}= product;
        let cantP = calcIds(cartProduct, product.id)
        if(calcIds(cartProduct,product.id) < 1){
            cartProduct.push(product.id);
            const id = product.id
            const cartItem = document.createElement('li');
            cartItem.className=`cart-product`;
            cartItem.id = product.id
            cartItem.textContent=`${name} - $${precio.toFixed(2)} x${calcIds(cartProduct,product.id)} `;
            const removeButton= document.createElement('button');
            removeButton.textContent='X';
            removeButton.className='btn-remove';
            removeButton.addEventListener('click', () =>{
                cart.splice(index,1);
                updateCart();
            });
            cartItem.appendChild(removeButton);
            cartList.appendChild(cartItem);
        }else{
            cartProduct.push(product.id);
            const cartItem = document.getElementById(product.id)
            const removeButton= document.createElement('button');
            removeButton.textContent='X';
            removeButton.className='btn-remove';
            cartItem.className=`cart-product`;
            cartItem.textContent=`${name} - $${precio.toFixed(2)} x${calcIds(cartProduct,product.id)} `;
            cartItem.appendChild(removeButton);
            removeButton.addEventListener('click', () =>{
                cart.splice(0,calcIds(cartProduct,product.id));
                updateCart();
            });
        }
        total += precio;
    });
    const totalElement = document.getElementById('total');
    totalElement.textContent= total.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
};


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
        cartProduct =[];
        updateCart();
        localStorage.removeItem('cart');
        p.innerText='Carrito vacio';
    }
});