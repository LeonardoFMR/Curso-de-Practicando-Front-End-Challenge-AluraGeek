import { servicesProducts } from "../services/product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");
const clearButton = document.querySelector("[data-clear]");

function createCard(name, price, image, id) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <div class="img-container">
            <img src="${image}" alt="${name}">
        </div>
        <div class="card-container--info">
            <p class="product-name">${name}</p>
            <div class="card-container--value">
            <p class="product-price">$${price}</p>
                <svg  class="delete-button" data-id="${id}" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 4.00016H14V2.33016C13.9765 1.68998 13.7002 1.08522 13.2315 0.64845C12.7629 0.211684 12.1402 -0.0214492 11.5 0.000157736H8.49997C7.85973 -0.0214492 7.23703 0.211684 6.7684 0.64845C6.29977 1.08522 6.02343 1.68998 5.99997 2.33016V4.00016H0.99997C0.734753 4.00016 0.480399 4.10552 0.292863 4.29305C0.105326 4.48059 -3.05176e-05 4.73494 -3.05176e-05 5.00016C-3.05176e-05 5.26538 0.105326 5.51973 0.292863 5.70726C0.480399 5.8948 0.734753 6.00016 0.99997 6.00016H1.99997V17.0002C1.99997 17.7958 2.31604 18.5589 2.87865 19.1215C3.44126 19.6841 4.20432 20.0002 4.99997 20.0002H15C15.7956 20.0002 16.5587 19.6841 17.1213 19.1215C17.6839 18.5589 18 17.7958 18 17.0002V6.00016H19C19.2652 6.00016 19.5195 5.8948 19.7071 5.70726C19.8946 5.51973 20 5.26538 20 5.00016C20 4.73494 19.8946 4.48059 19.7071 4.29305C19.5195 4.10552 19.2652 4.00016 19 4.00016ZM7.99997 14.0002C7.99997 14.2654 7.89461 14.5197 7.70708 14.7073C7.51954 14.8948 7.26519 15.0002 6.99997 15.0002C6.73475 15.0002 6.4804 14.8948 6.29286 14.7073C6.10533 14.5197 5.99997 14.2654 5.99997 14.0002V10.0002C5.99997 9.73494 6.10533 9.48059 6.29286 9.29305C6.4804 9.10552 6.73475 9.00016 6.99997 9.00016C7.26519 9.00016 7.51954 9.10552 7.70708 9.29305C7.89461 9.48059 7.99997 9.73494 7.99997 10.0002V14.0002ZM7.99997 2.33016C7.99997 2.17016 8.20997 2.00016 8.49997 2.00016H11.5C11.79 2.00016 12 2.17016 12 2.33016V4.00016H7.99997V2.33016ZM14 14.0002C14 14.2654 13.8946 14.5197 13.7071 14.7073C13.5195 14.8948 13.2652 15.0002 13 15.0002C12.7348 15.0002 12.4804 14.8948 12.2929 14.7073C12.1053 14.5197 12 14.2654 12 14.0002V10.0002C12 9.73494 12.1053 9.48059 12.2929 9.29305C12.4804 9.10552 12.7348 9.00016 13 9.00016C13.2652 9.00016 13.5195 9.10552 13.7071 9.29305C13.8946 9.48059 14 9.73494 14 10.0002V14.0002Z" fill="white"/>
                            </svg>
            </div>
        </div>
    `;

    card.querySelector(".delete-button").addEventListener("click", () => {
        servicesProducts.deleteProduct(id)
            .then(() => {
                productContainer.removeChild(card);
                console.log(`Producto con ID ${id} eliminado`);
            })
            .catch((error) => console.log(error));
    });

    productContainer.appendChild(card);
    return card;
}

const render = async () => {
    try {
        const listProducts = await servicesProducts.productList();
        console.log(listProducts);
        listProducts.forEach((product) => {
            productContainer.appendChild(
                createCard(product.name, product.price, product.image, product.id)
            );
        });
    } catch (error) {
        console.log(error);
    }
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value;
    const price = parseFloat(document.querySelector("[data-price]").value);
    const image = document.querySelector("[data-image]").value;

    if (isNaN(price) || price <= 0) {
        alert("Por favor, ingresa un precio válido.");
        return;
    }

    try {
        new URL(image);
    } catch (_) {
        alert("Por favor, ingresa una URL válida.");
        return;
    }

    servicesProducts.createProducts(name, price, image)
        .then((res) => {
            createCard(res.name, res.price, res.image, res.id);
            console.log(res);
        })
        .catch((res) => console.log(res));
});


clearButton.addEventListener("click", () => {
    const cards = productContainer.querySelectorAll(".card");

    cards.forEach((card) => {
        const id = card.querySelector(".delete-button").getAttribute("data-id");
        servicesProducts.deleteProduct(id)
            .then(() => {
                productContainer.removeChild(card);
                console.log(`Producto con ID ${id} eliminado`);
            })
            .catch((error) => console.log(error));
    });

    console.log("El botón Limpiar fue clickeado.");
});

render();

