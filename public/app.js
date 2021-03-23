const toCurrency = price => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

const toDate = date => {
    return new Intl.DateTimeFormat('en-En', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minutes: '2-digit',
        seconds: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
})

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', e => {
        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id;
            const csrf = e.target.dataset.csrf;

            fetch('/cart/remove/' + id, {
                    method: 'delete',
                    headers: {
                        'X-XSRF-TOKEN': csrf
                    }
                }).then(res => res.json())
                .then(card => {
                    if (card.scripts.length) {
                        const html = card.scripts.map(script => {
                            if (script) {
                                return `
                            <tr>
                            <td>${script.title}</td>
                            <td>${script.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${script._id}">Remove</button>
                            </td>
                        </tr>
                            `
                            }
                        }).join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = '<p>Card is empty</p>';
                    }
                });
        }
    });
}

M.Tabs.init(document.querySelectorAll('.tabs'));