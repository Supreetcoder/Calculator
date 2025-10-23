const display = document.getElementById('display')
const buttons = document.getElementById('buttons')
let current = ''
let lastResult = null
function updateDisplay() {
    display.textContent = current || (lastResult !== null ? String(lastResult) : '0')
}
function inputValue(val) {
    if (current === '' && val === '.') current = '0.'
    else current += val
    updateDisplay()
}
function clearAll() {
    current = ''
    lastResult = null
    updateDisplay()
}
function deleteOne() {
    current = current.slice(0, -1)
    updateDisplay()
}
function compute() {
    if (!current) return
    try {
        const expr = current.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
        const fn = new Function('return (' + expr + ')')
        const res = fn()
        if (!isFinite(res)) throw new Error('Math error')
        lastResult = Math.round((res + Number.EPSILON) * 100000000) / 100000000
        current = ''
        updateDisplay()
    } catch (e) {
        display.textContent = 'Error'
        current = ''
        lastResult = null
    }
}
buttons.addEventListener('click', e => {
    const btn = e.target.closest('button')
    if (!btn) return
    const action = btn.dataset.action
    const val = btn.dataset.value
    if (action === 'clear') clearAll()
    else if (action === 'delete') deleteOne()
    else if (action === 'equals') compute()
    else if (val) inputValue(val)
})
window.addEventListener('keydown', e => {
    const k = e.key
    if (k >= '0' && k <= '9') inputValue(k)
    else if (k === '.') inputValue('.')
    else if (k === 'Enter' || k === '=') { e.preventDefault(); compute() }
    else if (k === 'Backspace') deleteOne()
    else if (k === 'Escape') clearAll()
    else if (['+', '-', '*', '/', '%'].includes(k)) inputValue(k)
})
updateDisplay()