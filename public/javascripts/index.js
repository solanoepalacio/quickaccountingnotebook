window.onload = function () {
    const transactionHistoryContainer = document.querySelector('#transaction-history');
    
    document.querySelector('#refresh-button').addEventListener('click', () => {
        refreshTransactionData();
    });

    refreshTransactionData();


    function refreshTransactionData () {
        fetch('/api/account')
            .then((response) => response.json())
            .then((accountTransactions) => {
                renderTransactions(accountTransactions);
            })
            .catch((error) => {
                console.error('error', error)
            })
    }

    function renderTransactions (transactions) {
        const transactionElements = transactions.map((transaction) => {
            console.log('transaction', transaction);
            const transactionElement = createElement('div', {
                class: `transaction ${transaction.type}`
            });

            const innerContent = Object.entries(transaction).map(([key, value]) => {
                const container = createElement('div', {
                    class: `datum ${key}`
                });
                
                const keyPart = createElement('label', {
                    class: 'key part'
                });
                keyPart.innerHTML = key;
                container.appendChild(keyPart)

                const valuePart = createElement('div', {
                    class: 'part'
                });
                valuePart.innerHTML = value;
                container.appendChild(valuePart);
                return container;
            });
            innerContent.forEach(element => transactionElement.appendChild(element))

            transactionElement.addEventListener('click', () => {
                toggleActive(transactionElement);
            })

            return transactionElement;
        });

        const domFragment = document.createDocumentFragment();

        transactionElements.forEach((element) => {
            domFragment.appendChild(element)
        });

        transactionHistoryContainer.innerHTML = '';
        transactionHistoryContainer.appendChild(domFragment);
    }

    function toggleActive (element) {
        if (element.classList.contains('active')) {
            element.classList.remove('active');
        } else {
            element.classList.add('active');
        }
    }
}


function createElement (type, attributes) {
    const element = document.createElement(type);

    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
        element.setAttribute(attributeName, attributeValue);
    });

    return element;
}

