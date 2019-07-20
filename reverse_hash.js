function reverseHash(h) {
    let quotient = h;
    let letters = "acdegilmnoprstuw";
    let str = [];
    let remainder;
    for (let index = 0; quotient != 7; index++) {
        remainder = quotient % 37;
        quotient = Math.floor(quotient / 37);
        str.unshift(letters[remainder]);
    }
    return str;
}

console.log(reverseHash(680131659347));
console.log(reverseHash(930846109532517));