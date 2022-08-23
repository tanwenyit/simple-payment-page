export interface CardInfo {
    card_no: any;
    exp_month: any;
    exp_year: any;
    cvv: any;
}

export async function validate(card: CardInfo) {
    // eslint-disable-next-line no-useless-concat
    let url = "http://localhost:8081" + "/validation/handler";
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            card: card
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
}
