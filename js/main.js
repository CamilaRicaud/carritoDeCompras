


const cart = JSON.parse(localStorage.getItem('cart')) || [],
btnVaciar = document.getElementById('vaciar-button'),
cartLocal=localStorage.getItem('cart'),
cartList = document.getElementById('cart-list'),
p=document.getElementById('mensaje'),
checkoutButton= document.getElementById('checkout-button'),
productList = document.getElementById('product-list');



//Funcion para mostrar productos en el DOM

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



let products;
const fetchProducts= async(url)=>{
    const response= await fetch(url);
    const datos= await response.json()
    products=datos;
    crearHTML(datos);
};

fetchProducts('../data/data.json');



// Funcion para agregar productos al carrito de compras 

function updateCart(){
    cartList.innerHTML='';
    let total= 0;
    let cartProduct=[];
    cart.forEach((product,index)=>{
        const {name, precio,id}= product;
        let cantP = calcIds(cartProduct, product.id);
        if(calcIds(cartProduct, product.id) < 1){
            cartProduct.push(product.id);
            const id = product.id;
            const cartItem = document.createElement('li');
            cartItem.className=`cart-product`;
            cartItem.id = product.id;
            cartItem.textContent=`${name} - $${precio.toFixed(2)} x ${calcIds(cartProduct,product.id)} `;
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
            cartItem.textContent=`${name} - $${precio.toFixed(2)} x ${calcIds(cartProduct,product.id)} `;
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

function calcIds (array,id) {
    let cont = 0;
    array.forEach(i => {
        i === id && cont++
    });
    return cont;
};

updateCart();

//Eventos 

checkoutButton.addEventListener('click', ()=>{
    if( cart != ""){
        cart.length = 0;
        updateCart();
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: 'Cargando compra'
        })
        setTimeout(()=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Gracias por tu compra!',
                text:'Te estaremos enviando un Email con el link de pago.',
                showConfirmButton: false,
                timer: 2000,
                width: 450,
                margin: '3em',
            });
        },2000);

    }
})


btnVaciar.addEventListener('click',()=>{
    if(cart !=""){
        cart.splice('cart');
        cartProduct =[];
        updateCart();
        localStorage.removeItem('cart');
        p.innerText='Carrito vacio';
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Carrito vacio',
            showConfirmButton: false,
            timer: 1500,
            width: 450,
            margin: '3em',
        });
    }
});