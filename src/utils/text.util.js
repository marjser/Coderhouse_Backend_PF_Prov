
function textCapital (text) {
    const capital = text[0].toUpperCase() + text.slice(1)
    return capital
}

module.exports = textCapital